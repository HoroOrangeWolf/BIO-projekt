import { Container, Box, Typography } from '@mui/material';

const Dashboard = () => (
  <Container maxWidth="sm">
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
        System medyczny
      </Typography>
      <Typography variant="h5" align="center" color="text.secondary" paragraph>
        Projekt - bezpieczeństwo w inżynierii oprogramowania.
      </Typography>
    </Box>
  </Container>
);

export default Dashboard;
