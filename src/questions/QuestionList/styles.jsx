import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  padded: {
    paddingTop: '1rem',
  },
  select: {
    minWidth: 150,
  },
  related: {
    color: theme.palette.primary.main,
    fontSize: '0.7rem',

    '& span': {
      color: 'white',
    },
  },
  cursor: {
    cursor: 'pointer',
  },
  thead: {
    cursor: 'pointer',
    fontWeight: 'bold',

    '& svg': {
      fontSize: '0.8rem',
      verticalAlign: 'middle',
    },
  },
  badge: {
    right: '-5px',
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
}));

export default styles;
