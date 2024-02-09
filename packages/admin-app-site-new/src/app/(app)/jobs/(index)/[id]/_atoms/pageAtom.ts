import { atom, useAtom, useAtomValue } from 'jotai';

type Section =
  | 'customer'
  | 'address'
  | 'vehicle_creation'
  | 'vehicle_editing'
  | 'service_creation'
  | 'service_editing'
  | 'part_creation'
  | 'part_editing';

type SummarySection =
  | 'add_invoice_message'
  | 'edit_invoice_message'
  | 'add_payment'
  | 'edit_payment';

type DrawerType = 'photos' | 'comments' | 'invoice';

type PageAtomData = {
  currentStep: number;
  focusedSection?: Section | Section[] | null;
  priceSummaryFocusedSection?: SummarySection | null;
  showSpinner?: boolean;
  isPublishing?: boolean;
  isVehiclePhotosDrawerOpen?: boolean;
  isVehicleCommentsDrawerOpen?: boolean;
  isInvoiceDrawerOpen?: boolean;
};

const pageAtom = atom<PageAtomData>({ currentStep: 2 });

const drawerTypeToAtomKeyMap = {
  photos: 'isVehiclePhotosDrawerOpen',
  comments: 'isVehicleCommentsDrawerOpen',
  invoice: 'isInvoiceDrawerOpen',
} satisfies Record<DrawerType, keyof PageAtomData>;

export function usePageAtom() {
  const [data, setData] = useAtom(pageAtom);

  function setFocusedSection(focusedSection: Section | null) {
    setData(prev => ({ ...prev, focusedSection }));
  }

  function pushFocusedSection(focusedSection: Section) {
    setData(prev => ({
      ...prev,
      focusedSection: (Array.isArray(prev.focusedSection ?? [])
        ? [...(prev.focusedSection ?? []), focusedSection]
        : [prev.focusedSection, focusedSection]) as Section[],
    }));
  }

  function removeFocusedSection(focusedSection: Section) {
    setData(prev => ({
      ...prev,
      focusedSection: Array.isArray(prev.focusedSection)
        ? prev.focusedSection.filter(section => section !== focusedSection)
        : null,
    }));
  }

  function setPriceSummaryFocusedSection(
    priceSummaryFocusedSection: SummarySection | null
  ) {
    setData(prev => ({ ...prev, priceSummaryFocusedSection }));
  }

  function setShowSpinner(showSpinner: boolean) {
    setData(prev => ({ ...prev, showSpinner }));
  }

  function openDrawer(drawer: DrawerType) {
    setData(prev => ({
      ...prev,
      ...Object.values(drawerTypeToAtomKeyMap).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {} as Record<
          (typeof drawerTypeToAtomKeyMap)[keyof typeof drawerTypeToAtomKeyMap],
          false
        >
      ),
      [drawerTypeToAtomKeyMap[drawer]]: true,
    }));
  }

  function closeDrawer(drawer: DrawerType) {
    setData(prev => ({
      ...prev,
      [drawerTypeToAtomKeyMap[drawer]]: false,
    }));
  }

  function goToNextStep() {
    setData(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  }

  function setIsPublishing(isPublishing: boolean) {
    setData(prev => ({ ...prev, isPublishing }));
  }

  return {
    data,
    setFocusedSection,
    pushFocusedSection,
    removeFocusedSection,
    setPriceSummaryFocusedSection,
    setShowSpinner,
    openDrawer,
    closeDrawer,
    setIsPublishing,
    goToNextStep,
  };
}

export function useJobWorkflowStatus() {
  return useAtomValue(pageAtom).currentStep <= 3 ? 'draft' : 'published';
}

export function useShouldBlurSection() {
  return !!useAtomValue(pageAtom).focusedSection;
}

export function mountPageInitialState(initialState: PageAtomData) {
  return [pageAtom, initialState] as const;
}
