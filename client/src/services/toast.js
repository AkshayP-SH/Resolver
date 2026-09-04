// just the utility function here
export const showToast = (message, type = 'success') => {
  window.dispatchEvent(new CustomEvent('resolver-toast', { detail: { message, type } }));
};