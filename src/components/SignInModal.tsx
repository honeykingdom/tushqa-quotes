import {
  Modal,
  Typography,
  IconButton,
  Paper,
  Box,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { signIn } from "next-auth/client";
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
          <Button
            variant="contained"
            // @ts-expect-error
            color="fourthly"
            sx={{ mt: 2 }}
            onClick={() => signIn("twitch")}
          >
            <TwitchIcon style={{ width: 16 }} />
            &nbsp; Войти через Twitch
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default SignInModal;
