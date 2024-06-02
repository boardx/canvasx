'use client';
import { Typography, Card, Grid, Box, Button } from '@mui/joy';
import { useRouter } from 'next/navigation';

const Homepage = () => {
    const router = useRouter();
    return (
        <Box>
            <Typography level="h1" textAlign="center" mb={4}>
                CanvasX UI Component Demo
            </Typography>

            <Grid container spacing={4} sx={{ margin: 10 }}>



                <Grid xs={12} md={4} component="div" >
                    <Card variant="outlined">
                        <Box textAlign="center" p={2}>
                            <Typography level="h2">Text</Typography>
                            <Button variant="solid" onClick={() => { router.push('/text') }} >
                                Text
                            </Button>
                        </Box>
                    </Card>
                </Grid>

                <Grid xs={12} md={4} component="div" >
                    <Card variant="outlined">
                        <Box textAlign="center" p={2}>
                            <Typography level="h2">Sticky Notes</Typography>
                            <Button variant="solid" onClick={() => { router.push('/notes') }}  >
                                Sticky Notes
                            </Button>
                        </Box>
                    </Card>
                </Grid >

                <Grid xs={12} md={4} component="div" >
                    <Card variant="outlined">
                        <Box textAlign="center" p={2}>
                            <Typography level="h2">Shapes</Typography>
                            <Button variant="solid" onClick={() => { router.push('/shapes') }}  >
                                Shapes
                            </Button>
                        </Box>
                    </Card>
                </Grid>

                <Grid xs={12} md={4} component="div" >
                    <Card variant="outlined">
                        <Box textAlign="center" p={2}>
                            <Typography level="h2">Connector</Typography>
                            <Button variant="solid" onClick={() => { router.push('/connector') }} >
                                Connector
                            </Button>
                        </Box>
                    </Card>
                </Grid>

                <Grid xs={12} md={4} component="div"  >
                    <Card variant="outlined">
                        <Box textAlign="center" p={2}>
                            <Typography level="h2">Alignment & Guideline</Typography>
                            <Button variant="solid" onClick={() => { router.push('/align') }} >
                                Alignment & Guideline
                            </Button>
                        </Box>
                    </Card>
                </Grid>
                <Grid xs={12} md={4} component="div"  >
                    <Card variant="outlined">
                        <Box textAlign="center" p={2}>
                            <Typography level="h2">Draw</Typography>
                            <Button variant="solid" onClick={() => { router.push('/draw') }} >
                                Draw
                            </Button>
                        </Box>
                    </Card>
                </Grid>

            </Grid >
        </Box >
    );
};

export default Homepage;
