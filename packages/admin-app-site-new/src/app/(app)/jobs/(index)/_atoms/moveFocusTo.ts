class FocusMover {
  constructor() {
    this.dispatcher = this.dispatcher.bind(this);
    this.driver = this.driver.bind(this);
    this.end = this.end.bind(this);
  }

  dispatcher() {
    const dispatchersAutocomplete = document.getElementById(
      'dispatchers-autocomplete'
    );
    const isDispatchersSectionAlreadyFilled =
      !dispatchersAutocomplete ||
      dispatchersAutocomplete.getAttribute('disabled') !== null;

    if (isDispatchersSectionAlreadyFilled) {
      this.driver();
      return;
    }

    dispatchersAutocomplete.focus();
  }

  driver() {
    const driversAutocomplete = document.getElementById('drivers-autocomplete');
    const isDriversSectionAlreadyFilled =
      !driversAutocomplete ||
      driversAutocomplete.getAttribute('disabled') !== null;

    if (isDriversSectionAlreadyFilled) {
      this.end();
      return;
    }

    driversAutocomplete.focus();
  }

  // eslint-disable-next-line class-methods-use-this
  end() {
    const isOnEditMode = !!document.getElementById('edit-customer-save-button');

    if (isOnEditMode) {
      return;
    }

    const customerRefInput = document.getElementById(
      'customer-reference-number-input'
    );
    const isCustomerRefFilled =
      (customerRefInput?.getAttribute('value')?.trim().length ?? 0) > 0;

    if (customerRefInput && !isCustomerRefFilled) {
      customerRefInput.focus();
      return;
    }

    document.getElementById('save-and-next-button')?.focus();
  }
}

export const moveFocusTo = new FocusMover();
