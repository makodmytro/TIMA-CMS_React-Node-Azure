import React from 'react';
import {
  useRefresh,
  useNotify,
  useRedirect,
  useTranslate,
  useDataProvider,
} from 'react-admin';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import DeleteDialog from '../../common/components/DeleteDialog';

export default (props) => {
  const [open, setOpen] = React.useState(false);
  const translate = useTranslate();
  const notify = useNotify();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();
  const refresh = useRefresh();
  const [content, setContent] = React.useState(null);

  const _fetch = async () => {
    const { data } = await dataProvider.topicContentCounter(null, {
      id: props?.record?.id,
    });

    setContent(data);
  };

  React.useEffect(() => {
    if (open) {
      _fetch();
    }
  }, [open]);

  return (
    <>
      <Button
        className="error-btn"
        variant="outlined"
        onClick={(e) => {
          e.preventDefault();

          setOpen(true);
        }}
        {...props.button}
      >
        {translate('resources.topics.delete')}
      </Button>
      <DeleteDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          dataProvider.delete('topics', { id: props?.record?.id }).then(() => {
            notify('Deleted successfully');

            setOpen(false);

            if (props.afterDelete === 'refresh') {
              redirect('/topics?d=1');
            } else {
              redirect('/topics');
            }
          });
        }}
        title={`${translate('resources.topics.delete')}?`}
        confirmationText={translate('resources.topics.delete')}
        content={(
          <Box px={10} mt={2}>
            <Typography align="center" variant="body2">
              {translate('misc.you_will_lose')}:
            </Typography>
            <Box display="flex" justifyContent="center" mt={2}>
              <Box>
                <Typography variant="body2">
                  - {translate('resources.topics.delete_cascade_one')}
                  &nbsp;
                  {!!content && <>({content.questions || 0})</>}
                </Typography>
                <Typography variant="body2">
                  - {translate('resources.topics.delete_cascade_two')}
                  &nbsp;
                  {!!content && <>({content.answers || 0})</>}
                </Typography>
                <Typography variant="body2">
                  - {translate('resources.topics.delete_cascade_three')}
                  &nbsp;
                  {!!content && <>({content.permissions || 0})</>}
                </Typography>
                <Typography variant="body2">
                  - {translate('resources.topics.delete_cascade_four')}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      />
    </>
  );
};
