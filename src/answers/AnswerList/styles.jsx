import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  padded: {
    paddingTop: '1rem',
  },
  select: {
    minWidth: 150,
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '16px',
    minHeight: '80px',
    alignItems: 'flex-end',
    paddingTop: 0,

    '& div': {
      paddingRight: 16,
    },
  },
  markdown: {
    display: 'flex',

    '& .second': {
      flex: 1,
    },
  },
  related: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    fontSize: '1rem',
    marginRight: '15px',

    '& span': {
      color: 'white',
      marginLeft: '5px',
      marginRight: '5px',
    },
  },
}));

export default styles;
