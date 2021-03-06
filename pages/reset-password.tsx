import { makeStyles } from '@mui/styles';
import { Grid, Grow, InputAdornment, Link, TextField, Typography, useTheme } from '@mui/material';
import { LoadingButton as Button } from '@mui/lab';
import { FormEvent, ReactElement, ReactNode, useState } from 'react';
import { AxiosError } from 'axios';
import { LockOutlined, MailOutlined } from '@mui/icons-material';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import useMe from '../hooks/me';
import epAPI from '../lib/api';
import SignInLayout from '../layouts/SignIn';
import { NextPageWithLayout } from '../types/layout';
import { ValidationErrorResponse } from '../types/errors/validation';
import useNotifier from '../hooks/notifier';
import { extractValidationError } from '../lib/error';

const useStyles = makeStyles(() => {
  const theme = useTheme();
  return {
    form: {
      width: 'auto',
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    successView: {
      textShadow: '0px 0px 5px black',
    },
  };
});

const ResetPasswordPage: NextPageWithLayout = () => {
  const classes = useStyles();
  const router = useRouter();
  const { notifyError, notifySuccess } = useNotifier();

  const { mutate } = useMe();
  const { token } = router.query;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendEmailSuccess, setSendEmailSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [repeatEmail, setRepeatEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [validationError, setValidationError] = useState<ValidationErrorResponse | null>(null);

  const onValidateEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email !== repeatEmail) {
      return;
    }
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      await epAPI.post('/validate/reset-password-email', { email });
      setSendEmailSuccess(true);
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.data.name === 'ValidationError') {
        setValidationError(err.response.data);
      } else if (err.response?.data?.message) {
        notifyError(err.response?.data?.message);
      } else {
        notifyError('???????????????????????????');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== repeatPassword) {
      return;
    }
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      await epAPI.post('/reset-password', {
        validateToken: token,
        password,
      });
      notifySuccess('????????????????????????????????????', 5000);
      mutate();
      await router.push('/');
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.data.name === 'ValidationError') {
        setValidationError(err.response.data);
      } else if (err.response?.data?.message) {
        notifyError(err.response?.data?.message);
      } else {
        notifyError('???????????????????????????');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sendEmailSuccess) {
    return (
      <Grow in>
        <Grid container direction="column" justifyContent="center" alignItems="center">
          <Grid item>
            <Typography className={classes.successView} variant="h2">????</Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.successView} variant="h6">?????????????????????</Typography>
          </Grid>
        </Grid>
      </Grow>
    );
  }

  return (
    <div className={classes.form}>
      {!token ? (
        <form onSubmit={onValidateEmailSubmit} className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="????????????"
            error={!!extractValidationError(validationError?.detail, 'email')}
            helperText={extractValidationError(validationError?.detail, 'email')?.msg}
            InputProps={{
              type: 'email',
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlined />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={repeatEmail}
            onChange={(e) => setRepeatEmail(e.target.value)}
            label="??????????????????"
            error={!!repeatEmail && email !== repeatEmail}
            helperText={!!repeatEmail && email !== repeatEmail && '???????????????????????????'}
            InputProps={{
              type: 'email',
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlined />
                </InputAdornment>
              ),
            }}
          />
          <Button
            className={classes.submit}
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
          >
            ??????????????????
          </Button>
          <Grid container justifyContent="space-between" direction="row-reverse">
            <Grid item>
              <Link color="textSecondary" component={NextLink} href="/signin" variant="body2">????????????</Link>
            </Grid>
          </Grid>
        </form>
      ) : (
        <form onSubmit={onResetPassword} className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="??????"
            error={!!extractValidationError(validationError?.detail, 'password')}
            helperText={extractValidationError(validationError?.detail, 'password')?.msg}
            InputProps={{
              type: 'password',
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={!!repeatPassword && password !== repeatPassword}
            helperText={!!repeatPassword && password !== repeatPassword ? '???????????????????????????' : ''}
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            label="????????????"
            InputProps={{
              type: 'password',
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined />
                </InputAdornment>
              ),
            }}
          />
          <Button
            className={classes.submit}
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
          >
            ????????????
          </Button>
        </form>
      )}
    </div>
  );
};

ResetPasswordPage.getLayout = (page: ReactElement): ReactNode => (
  <SignInLayout>{page}</SignInLayout>
);

export default ResetPasswordPage;
