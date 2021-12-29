import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { indigo } from '@mui/material/colors';
import { Add as AddIcon } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import NextLink from 'next/link';
import useSWR from 'swr';
import TimeChip from '../TimeChip';
import MemberChip from '../Member/MemberChip';
import CampaignListSkeleton from '../Skeleton/CampaignListSkeleton';
import useMe from '../../hooks/me';
import { Campaign, MyCampaignsListResponse } from '../../types/campaign';

const useStyles = makeStyles(() => {
  const theme = useTheme();
  return {
    paper: {
      padding: theme.spacing(2, 3, 4, 3),
    },
    description: {
    },
    creatorDesc: {
      display: 'flex',
      alignItems: 'center',
    },
    noDescription: {
      fontStyle: 'italic',
    },
    charactersGroup: {
    },
    characters: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      border: '0px',
      backgroundColor: indigo[300],
      color: theme.palette.getContrastText(indigo[300]),
      textDecoration: 'none',
    },
    MenuDivider: {
      margin: theme.spacing(2, 0),
    },
  };
});

const MyCampaignsList = () => {
  const { me } = useMe();
  const classes = useStyles();
  const { data: response, error, mutate } = useSWR<MyCampaignsListResponse>('/me/campaigns');
  const campaigns = response?.data ?? [];
  const isLoading = !campaigns && !error;

  return (
    <Paper className={classes.paper}>
      <Grid container direction="column">
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h6">我参与的战役</Typography>
          <Tooltip title="咕咕咕.jpg">
            <Button variant="contained" color="primary">
              <AddIcon />
              创建新战役
            </Button>
          </Tooltip>
        </Grid>
        <Divider className={classes.MenuDivider} />
        <Grid container item spacing={3}>
          {!isLoading && campaigns && campaigns.map((campaign) => (
            <Grid key={campaign.id} item xs sm={6} md={3}>
              <Card elevation={3}>
                <NextLink href={`/campaign/${campaign.id}`}>
                  <CardActionArea>
                    <CardContent>
                      <Typography className={classes.creatorDesc} noWrap gutterBottom variant="body2" color="textSecondary">
                        由
                        <MemberChip human={campaign.owner} />
                        创建于
                        <TimeChip timestamp={campaign.created} />
                      </Typography>
                      <Typography noWrap variant="h6">{campaign.name}</Typography>
                      {campaign.description ? (
                        <Typography className={classes.description} noWrap paragraph variant="body2" color="textSecondary">
                          {campaign.description}
                        </Typography>
                      ) : (
                        <Typography className={classes.noDescription} noWrap paragraph variant="body2" color="textSecondary">
                          无描述
                        </Typography>
                      )}
                      <Grid container justifyContent="space-between" alignItems="center">
                        <AvatarGroup className={classes.charactersGroup} max={5} spacing="medium">
                          {campaign.characters?.map((character) => (
                            <Tooltip key={character.id} title={character.name}>
                              <Avatar
                                className={classes.characters}
                                src={character.avatar}
                              >
                                <Typography variant="caption" color="textSecondary">
                                  {character.name[0]}
                                </Typography>
                              </Avatar>
                            </Tooltip>
                          ))}
                        </AvatarGroup>
                        {campaign.relationship?.isGm && (
                        <Chip size="small" label="DM" />
                        )}
                        {!campaign.relationship?.isGm && campaign.relationship?.usingCharacter && (
                          <NextLink href={`/character/${campaign.relationship?.usingCharacter?.id}`}>
                            <Tooltip title="查看角色">
                              <Chip
                                size="small"
                                avatar={(
                                  <Avatar src={campaign.relationship?.usingCharacter?.avatar}>
                                    {campaign.relationship?.usingCharacter?.name[0]}
                                  </Avatar>
                              )}
                                label={campaign.relationship?.usingCharacter?.name}
                              />
                            </Tooltip>
                          </NextLink>
                        )}
                      </Grid>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
              </Card>
            </Grid>
          ))}
          {error && (
            <Grid container direction="column" justifyContent="center" alignItems="center">
              <Grid item>
                <Typography variant="h2">💣</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  出错了，
                  <Button variant="text" onClick={() => mutate()}>刷新</Button>
                  一下试试？
                </Typography>
              </Grid>
            </Grid>
          )}
          {!isLoading && campaigns && campaigns.length === 0 && (
            <Grid container direction="column" justifyContent="center" alignItems="center">
              <Grid item>
                <Typography variant="h2">🤔</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  看起来你还没有参与过战役
                  {!me?.externalInfo?.qq && (
                    <>
                      <Typography variant="inherit">，不如先</Typography>
                      <Link component={NextLink} href="/settings/external">
                        去绑定
                      </Link>
                      <Typography variant="inherit">
                        一下外部帐号？
                      </Typography>
                    </>
                  )}
                </Typography>
              </Grid>
            </Grid>
          )}
          {isLoading && (
            <CampaignListSkeleton />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MyCampaignsList;
