import Alert from "@material-ui/lab/Alert";
import SnackBar from "@material-ui/core/Snackbar";

const Toast = (props) => {
  const { open, setOpen, isError, message } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SnackBar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={5000}
      open={open}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={isError ? "warning" : "success"}
        variant="filled"
      >
        {isError ? message.error : message.success}
      </Alert>
    </SnackBar>
  );
};

export default Toast;
