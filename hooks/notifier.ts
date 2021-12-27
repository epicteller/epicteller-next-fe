import { OptionsObject, SnackbarKey, SnackbarMessage, useSnackbar } from 'notistack';

export interface Notifier {
  notify: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey
  notifyInfo: notifyFunc
  notifySuccess: notifyFunc
  notifyError: notifyFunc
  notifyWarn: notifyFunc
}

type notifyFunc = (message: SnackbarMessage, duration?: number) => SnackbarKey

const useNotifier = (): Notifier => {
  const { enqueueSnackbar } = useSnackbar();

  const notify = (message: SnackbarMessage, options?: OptionsObject): SnackbarKey => {
    const key = Date.now() + Math.random();
    enqueueSnackbar(message, { key, ...options });
    return key;
  };

  const notifyInfo = (message: SnackbarMessage, duration: number = 3000): SnackbarKey => notify(message, {
    variant: 'info',
    autoHideDuration: duration,
  });

  const notifySuccess = (message: SnackbarMessage, duration: number = 3000): SnackbarKey => notify(message, {
    variant: 'success',
    autoHideDuration: duration,
  });

  const notifyError = (message: SnackbarMessage, duration: number = 10000): SnackbarKey => notify(message, {
    variant: 'error',
    autoHideDuration: duration,
  });

  const notifyWarn = (message: SnackbarMessage, duration: number = 5000): SnackbarKey => notify(message, {
    variant: 'warning',
    autoHideDuration: duration,
  });

  return {
    notify, notifyError, notifyInfo, notifySuccess, notifyWarn,
  };
};

export default useNotifier;
