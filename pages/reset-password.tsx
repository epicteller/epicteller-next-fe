import { makeStyles } from '@mui/styles';
import { Grid, Grow, InputAdornment, Link, TextField, Typography, useTheme } from '@mui/material';
import { LoadingButton as Button } from '@mui/lab';
import { FormEvent, useState } from 'react';
import { AxiosError } from 'axios';
import { LockOutlined, MailOutlined } from '@mui/icons-material';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import useMe from '../hooks/me';
import epAPI from '../lib/api';
import SignInLayout from '../components/layout/SignIn';
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
        notifyError('出错了，请稍后再试');
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
      notifySuccess('密码重置成功，请重新登录', 5000);
      mutate();
      await router.push('/');
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.data.name === 'ValidationError') {
        setValidationError(err.response.data);
      } else if (err.response?.data?.message) {
        notifyError(err.response?.data?.message);
      } else {
        notifyError('出错了，请稍后再试');
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
            <Typography className={classes.successView} variant="h2">🎉</Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.successView} variant="h6">已发送重置邮件</Typography>
          </Grid>
        </Grid>
      </Grow>
    );
  }

  return (
    <SignInLayout>
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
              label="邮箱地址"
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
              label="确认邮箱地址"
              error={!!repeatEmail && email !== repeatEmail}
              helperText={!!repeatEmail && email !== repeatEmail && '两次邮箱输入不一致'}
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
              发送重置邮件
            </Button>
            <Grid container justifyContent="space-between" direction="row-reverse">
              <Grid item>
                <Link color="textSecondary" component={NextLink} href="/" variant="body2">返回登录</Link>
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
              label="密码"
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
              helperText={!!repeatPassword && password !== repeatPassword ? '两次密码输入不一致' : ''}
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              label="确认密码"
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
              重置密码
            </Button>
          </form>
        )}
      </div>
    </SignInLayout>
  );
};

export default ResetPasswordPage;
