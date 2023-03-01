import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

const chatLayout = () => {
  return <Box className="chatContainer">
    <Grid container >
        <Grid className="chatTitle">
            <Grid className="onlineFriends"></Grid>
            <Grid className="recentChats"></Grid>
        </Grid>
        <Grid className="chatMessages"></Grid>
    </Grid>
  </Box>;
};
