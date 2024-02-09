import assert from 'node:assert/strict';
import Stripe from 'stripe';
import { Config } from 'sst/node/config';

import { z } from 'zod';
import { IS_SANDBOX } from '@environment';
import { IdScalar, PhoneScalar } from '@utils/schema';

export type StripeID = string;

export const API_VERSION: Stripe.LatestApiVersion = '2023-08-16';

// https://stripe.com/docs/connect/setting-mcc#list
const MCC = '7538'; // auto_service_shops

/**
 * Stripe client
 */
let _stripe: Stripe | null = null;
export const useStripe = () => {
  if (!_stripe) {
    _stripe = new Stripe(Config.STRIPE_SK, { apiVersion: API_VERSION });
  }
  return _stripe;
};

/**
 * Create Stripe Connect account
 */
const createAccountParams = z.object({
  userId: IdScalar,
  email: z.string().email().optional(),
  phone: PhoneScalar,
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  businessName: z.string().min(1),
});
export type CreateAccountParams = z.infer<typeof createAccountParams>;
export const createAccount = async (params: CreateAccountParams) => {
  const {
    userId,
    email,
    phone: _phone,
    firstname,
    lastname,
    businessName,
  } = createAccountParams.parse(params);
  const phone = IS_SANDBOX ? undefined : formatStripePhone(_phone);
  const { id: stripeId } = await useStripe().accounts.create({
    type: 'express',
    country: 'US',
    business_type: 'individual',
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    company: { phone },
    email,
    individual: { first_name: firstname, last_name: lastname, email, phone },
    metadata: { stage: Config.STAGE, userId },
    settings: { payouts: { schedule: { interval: 'manual' } } },
    business_profile: {
      name: businessName,
      mcc: MCC,
      url: 'https://www.truckup.com',
    },
  });
  return stripeId as StripeID;
};
const formatStripePhone = (phone: string) =>
  phone.length === 11 && phone.startsWith('1') ? phone.slice(1) : phone;

/**
 * Manage/Onboard Stripe Connect accounts
 */
const FROM = 'STRIPE_ONBOARDING';
const ACTION_REFRESH = 'REFRESH';
const ACTION_RETURN = 'RETURN';
export const createOnboardingLink = async (stripeId: StripeID) => {
  const { url } = await useStripe().accountLinks.create({
    account: stripeId,
    refresh_url: `https://www.truckup.com?from=${FROM}&action=${ACTION_REFRESH}`,
    return_url: `https://www.truckup.com?from=${FROM}&action=${ACTION_RETURN}`,
    type: 'account_onboarding',
  });
  return url;
};
export const createDashboardLink = async (stripeId: StripeID) => {
  z.string().parse(stripeId);
  const { url } = await useStripe().accounts.createLoginLink(stripeId);
  return url;
};

/**
 * External accounts, i.e. bank accounts or debit cards used for cashouts
 */
const BANK_ACCOUNT_OBJECT: Stripe.BankAccount['object'] = 'bank_account';
const CARD_OBJECT: Stripe.Card['object'] = 'card';
const accountBaseSchema = z.object({
  id: z.string(),
  object: z.union([z.literal(BANK_ACCOUNT_OBJECT), z.literal(CARD_OBJECT)]),
  last4: z.string(),
  availablePayoutMethods: z.union([z.array(z.string()), z.null()]).optional(),
});
export const accountBankSchema = accountBaseSchema.extend({
  object: z.literal(BANK_ACCOUNT_OBJECT),
  bankName: z.string().nullable(),
});
export const accountCardSchema = accountBaseSchema.extend({
  object: z.literal(CARD_OBJECT),
  brand: z.string(),
  funding: z.string(),
});
export type IAccountBase = z.infer<typeof accountBaseSchema>;
export type IAccountBank = z.infer<typeof accountBankSchema>;
export type IAccountCard = z.infer<typeof accountCardSchema>;
interface IExternalAccountOptions {
  raw?: boolean;
}
export function listExternalAccounts(
  stripeId: StripeID,
  options?: { raw?: false }
): Promise<(IAccountBank | IAccountCard)[]>;
export function listExternalAccounts(
  stripeId: StripeID,
  options: { raw: true }
): Promise<Stripe.Response<Stripe.ApiList<Stripe.BankAccount | Stripe.Card>>>;
export async function listExternalAccounts(
  stripeId: StripeID,
  { raw = false }: IExternalAccountOptions = {}
): Promise<
  | Stripe.Response<Stripe.ApiList<Stripe.BankAccount | Stripe.Card>>
  | (IAccountBank | IAccountCard)[]
> {
  z.string().parse(stripeId);
  const res = await useStripe().accounts.listExternalAccounts(stripeId, {
    limit: 5,
  });
  if (raw) return res;
  assert.ok(!res.has_more, `User has more accounts, not handled!`);
  return res.data.map((account) => formatExternalAccount(account));
}
export function formatExternalAccount(
  account: Stripe.BankAccount
): IAccountBank;
export function formatExternalAccount(account: Stripe.Card): IAccountCard;
export function formatExternalAccount(
  account: Stripe.BankAccount | Stripe.Card
): IAccountBank | IAccountCard;
export function formatExternalAccount(
  account: Stripe.BankAccount | Stripe.Card
): IAccountBank | IAccountCard {
  const { object } = account;
  if (object === 'bank_account') return formatBankAccount(account);
  if (object === 'card') return formatCard(account);
  // @ts-expect-error invariant
  throw new Error(`Bad stripe external account type: ${account?.object}`);
}
const formatBankAccount = ({
  id,
  object,
  last4,
  available_payout_methods: availablePayoutMethods,
  bank_name: bankName,
}: Stripe.BankAccount): IAccountBank => ({
  id,
  object,
  last4,
  availablePayoutMethods,
  bankName,
});
const formatCard = ({
  id,
  object,
  last4,
  available_payout_methods: availablePayoutMethods,
  brand,
  funding,
}: Stripe.Card): IAccountCard => ({
  id,
  object,
  last4,
  availablePayoutMethods,
  brand,
  funding,
});

/**
 * Payments
 */
export interface TCreatePaymentIntentParams {
  amount: number;
  metadata?: Stripe.MetadataParam;
}
export const createPaymentIntent = async ({
  amount,
  metadata = {},
}: TCreatePaymentIntentParams) => {
  const { client_secret: clientSecret } =
    await useStripe().paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: createMetadata(metadata),
    });
  return { clientSecret };
};

/**
 * Shared helpers
 */
const createMetadata = (metadata: Stripe.MetadataParam = {}) => ({
  stage: Config.STAGE,
  ...metadata,
});

export default {
  useStripe,

  createAccount,

  createOnboardingLink,
  createDashboardLink,

  listExternalAccounts,
  formatExternalAccount,

  createPaymentIntent,

  API_VERSION,
};
