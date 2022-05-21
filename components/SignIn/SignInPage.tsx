import { makeStyles } from '@mui/styles';
import { Grid, InputAdornment, Link, TextField, useTheme } from '@mui/material';
import { LoadingButton as Button } from '@mui/lab';
import { FormEvent, useState } from 'react';
import { AxiosError } from 'axios';
import { LockOutlined, MailOutlined } from '@mui/icons-material';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import useMe from '../../hooks/me';
import epAPI from '../../lib/api';
import SignInLayout from '../../layouts/SignIn';
import { NextPageWithLayout } from '../../types/layout';

const useStyles = makeStyles(() => {
  const theme = useTheme();
  return {
    form: {
      width: '100%',
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  };
});

const SignInPage: NextPageWithLayout = () => {
  const router = useRouter();
  const classes = useStyles();
  const { mutate } = useMe();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await epAPI.post('/login', {
        email,
        password,
      });
      await mutate();
      await router.push('/');
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.status! < 500) {
        setErrorMessage(err.response?.data?.message);
      } else {
        setErrorMessage('出错了，请稍后再试');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SignInLayout>
      <form onSubmit={onSubmit} className={classes.form}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="邮箱地址"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errorMessage}
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
          label="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errorMessage}
          helperText={errorMessage}
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
          loading={isSubmitting}
          type="submit"
          variant="contained"
          fullWidth
          color="primary"
        >
          登录
        </Button>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Link color="textSecondary" component={NextLink} href="/reset-password" variant="body2">忘记密码？</Link>
          </Grid>
          <Grid item>
            <Link color="textSecondary" component={NextLink} href="/register" variant="body2">注册帐号</Link>
          </Grid>
        </Grid>
      </form>
    </SignInLayout>
  );
};

export default SignInPage;
