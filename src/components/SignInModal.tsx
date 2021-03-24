import { Modal, Typography, IconButton, Paper, Box } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { signIn } from "next-auth/client";
import PurpleButton from "components/PurpleButton";
import TwitchIcon from "icons/twitch";

type Props = {
  open: boolean;
  onClose: () => void;
};

const SignInModal = ({ open, onClose }: Props) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          minWidth: 240,
          maxWidth: 400,
          p: 3,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ position: "relative" }}>
          Вход
          <IconButton
            size="small"
            sx={{ position: "absolute", top: 0, right: 0 }}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Вам нужно войти, чтобы оценивать цитаты
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <PurpleButton
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => signIn("twitch")}
          >
            <TwitchIcon style={{ width: 16 }} />
            &nbsp; Войти через Twitch
          </PurpleButton>
        </Box>
      </Paper>
    </Modal>
  );
};

export default SignInModal;
