import { format } from '@/app/_utils';

type Person = {
  firstname: string;
  lastname?: string | null;
  phone?: string | null;
  secondary_phone?: string | null;
  is_no_text_messages?: boolean;
};

export function mountPersonObject<T extends Person>(person?: T | null) {
  if (!person) {
    return null;
  }

  return {
    name: [person.firstname.trim(), person.lastname?.trim()]
      .filter(Boolean)
      .join(' '),
    formattedPhone: person.phone ? format.phoneNumber(person.phone) : null,
    formattedSecondaryPhone: person.secondary_phone
      ? format.phoneNumber(person.secondary_phone)
      : null,
    disableSMS: !!person.is_no_text_messages,
  };
}
