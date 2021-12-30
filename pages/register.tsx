import { makeStyles } from '@mui/styles';
import {
  Alert,
  CircularProgress,
  Grid,
  Grow,
  InputAdornment,
  Link,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { LoadingButton as Button } from '@mui/lab';
import { useRouter } from 'next/router';
import { FormEvent, ReactElement, ReactNode, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import useSWR from 'swr';
import NextLink from 'next/link';
import { LockOutlined, MailOutlined, PersonOutlined } from '@mui/icons-material';
import { NextPageWithLayout } from '../types/layout';
import useNotifier from '../hooks/notifier';
import useMe from '../hooks/me';
import { ValidationErrorResponse } from '../types/errors/validation';
import epAPI from '../lib/api';
import { extractValidationError } from '../lib/error';
import SignInLayout from '../layouts/SignIn';
import Title from '../components/util/title';

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

interface RegisterInfo {
  email: string
}

const RegisterPage: NextPageWithLayout = () => {
  const classes = useStyles();
  const router = useRouter();
  const { notifyError, notifySuccess } = useNotifier();
  const { mutate } = useMe();
  const [token, setToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendEmailSuccess, setSendEmailSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [repeatEmail, setRepeatEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [validationError, setValidationError] = useState<ValidationErrorResponse | null>(null);
  const { data: registerInfo, error } = useSWR<RegisterInfo>(token ? `/register?token=${token}` : null);

  useEffect(() => {
    if (router && router.query) {
      setToken(router.query.token as string);
    }
  }, [router]);

  const onValidateEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email !== repeatEmail || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      await epAPI.post('/validate/register', { email });
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

  const onRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== repeatPassword) {
      return;
    }
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      await epAPI.post('/register', {
        validateToken: token,
        password,
        name,
      });
      mutate();
      notifySuccess('注册成功');
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

  const isValidatingToken = token && !registerInfo && !error;
  const lockEmail = isValidatingToken || !!registerInfo;
  const isTokenError = token && error;

  useEffect(() => {
    if (registerInfo && !error) {
      setEmail(registerInfo.email);
    }
  }, [registerInfo, error]);

  if (sendEmailSuccess) {
    return (
      <Grow in>
        <Grid container direction="column" justifyContent="center" alignItems="center">
          <Grid item>
            <Typography className={classes.successView} variant="h2">🎉</Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.successView} variant="h6">已发送验证邮件</Typography>
          </Grid>
        </Grid>
      </Grow>
    );
  }

  return (
    <div className={classes.form}>
      {isTokenError && (
        <Alert onClose={() => setToken(null)} severity="error">邮箱验证链接已失效，请重试</Alert>
      )}
      {!token || isTokenError ? (
        <form onSubmit={onValidateEmailSubmit} className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={lockEmail}
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
            disabled={lockEmail}
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
            loading={isSubmitting}
          >
            发送验证邮件
          </Button>
          <Grid container justifyContent="space-between" direction="row-reverse">
            <Grid item>
              <Link color="textSecondary" component={NextLink} href="/" variant="body2">已有帐号？返回登录</Link>
            </Grid>
          </Grid>
        </form>
      ) : (
        <form onSubmit={onRegister} className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={lockEmail}
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
              endAdornment: (
                // eslint-disable-next-line react/jsx-no-useless-fragment
                <>
                  {
                    isValidatingToken && (
                      <InputAdornment position="end">
                        <CircularProgress color="inherit" size="1.2rem" thickness={5} />
                      </InputAdornment>
                    )
                  }
                </>
              ),
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="用户名"
            placeholder="其他人对你的称呼"
            error={!!extractValidationError(validationError?.detail, 'name')}
            helperText={extractValidationError(validationError?.detail, 'name')?.msg}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlined />
                </InputAdornment>
              ),
            }}
          />
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
            loading={isSubmitting}
          >
            注册
          </Button>
        </form>
      )}
    </div>
  );
};

RegisterPage.getLayout = (page: ReactElement): ReactNode => (
  <SignInLayout>
    <>
      <Title title="注册帐号" />
      {page}
    </>
  </SignInLayout>
);

export default RegisterPage;
