import {
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { Edit as EditIcon } from '@mui/icons-material';
import { useInterval } from 'react-use';
import { AxiosError } from 'axios';
import { makeStyles } from '@mui/styles';
import { NextPageWithLayout } from '../../types/layout';
import epAPI from '../../lib/api';
import useNotifier from '../../hooks/notifier';
import useMe from '../../hooks/me';
import SettingsLayout from '../../layouts/Settings';
import Title from '../../components/util/Title';

const useStyles = makeStyles(() => {
  const theme = useTheme();
  return {
    form: {
      width: '100%',
    },
    paper: {
      padding: theme.spacing(2, 3, 2, 3),
    },
    external: {
      padding: theme.spacing(2, 1),
    },
    bindBtn: {
      marginLeft: theme.spacing(1),
    },
  };
});

export interface BindDialogProps {
  onClose: () => void
  open?: boolean
}

const BindQQDialog = ({ onClose, open = false }: BindDialogProps) => {
  const classes = useStyles();
  const { mutate } = useMe();
  const { notifyError } = useNotifier();
  const [externalId, setExternalId] = useState('');
  const [token, setToken] = useState('');
  const [emailCD, setEmailCD] = useState(0);
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useInterval(() => {
    if (emailCD <= 0) {
      return;
    }
    setEmailCD(emailCD - 1);
  }, emailCD ? 1000 : null);

  const changeExternalId = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const s = event.target.value;
    if (/^\d*$/.test(s)) {
      setExternalId(s);
    }
  };

  const changeToken = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const s = event.target.value;
    if (/^\d*$/.test(s) && s.length <= 6) {
      setToken(s);
    }
  };

  const validateEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    try {
      await epAPI.post('/validate/send-external-email', { externalType: 'QQ', externalId });
      setSent(true);
      setEmailCD(60);
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.data?.message) {
        notifyError(err.response?.data?.message);
      } else {
        notifyError('出错了，请稍后再试');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const bindExternal = async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      await epAPI.post('/bind-external', { externalType: 'QQ', externalId, validateToken: token });
      await mutate();
      onClose();
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.data?.message) {
        notifyError(err.response?.data?.message);
      } else {
        notifyError('出错了，请稍后再试');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle>
        绑定 QQ 帐号
      </DialogTitle>
      <DialogContent>
        <DialogContentText variant="body2" color="textSecondary">
          {externalId ? `${externalId}@qq.com ` : '你的数字邮箱地址'}
          将会收到一封验证邮件，请确保 QQ 邮箱的「数字帐号」功能已开启。
        </DialogContentText>
        <form className={classes.form} onSubmit={validateEmailSubmit}>
          <Grid container alignItems="center" spacing={3}>
            <Grid item xs={8}>
              <TextField
                autoFocus
                required
                variant="outlined"
                margin="dense"
                label="QQ 帐号"
                value={externalId}
                onChange={changeExternalId}
                InputProps={{
                  endAdornment: (<InputAdornment position="end">@qq.com</InputAdornment>),
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <Button fullWidth type="submit" variant="contained" color="primary" disabled={!!emailCD}>
                {emailCD ? `${emailCD} 秒后重发` : '发送验证邮件'}
              </Button>
            </Grid>
          </Grid>
        </form>
        <Collapse in={sent}>
          <TextField
            autoFocus
            required
            fullWidth
            variant="outlined"
            margin="dense"
            label="验证码"
            placeholder="请按照邮件中的提示输入验证码"
            value={token}
            onChange={changeToken}
          />
        </Collapse>
      </DialogContent>
      <DialogActions>
        <Button>取消</Button>
        <Button onClick={bindExternal} disabled={!(externalId && token.length === 6)}>绑定</Button>
      </DialogActions>
    </Dialog>
  );
};

const ExternalSettingsPage: NextPageWithLayout = () => {
  const classes = useStyles();
  const { me } = useMe();

  const [qqDialogOpen, setQQDialogOpen] = useState(false);

  return (
    <Paper className={classes.paper}>
      <BindQQDialog open={qqDialogOpen} onClose={() => setQQDialogOpen(false)} />
      <Typography gutterBottom variant="h5">外部帐号</Typography>
      <Divider />
      <Grid className={classes.external} container spacing={4}>
        <Grid item xs sm={12} md={8}>
          <Typography gutterBottom variant="subtitle1">QQ 帐号</Typography>
          {me?.externalInfo?.qq ? (
            <Typography gutterBottom variant="body2" color="textSecondary">
              已绑定：
              {me?.externalInfo?.qq}
            </Typography>
          ) : (
            <>
              <Typography display="inline" gutterBottom variant="body2" color="textSecondary">
                未绑定
              </Typography>
              <Button
                className={classes.bindBtn}
                size="small"
                startIcon={<EditIcon />}
                onClick={() => setQQDialogOpen(true)}
              >
                绑定
              </Button>
            </>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

ExternalSettingsPage.getLayout = (page) => (
  <SettingsLayout>{page}</SettingsLayout>
);

export default ExternalSettingsPage;
