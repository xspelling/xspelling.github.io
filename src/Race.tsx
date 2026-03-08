import { Alert, Box, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Typography } from "@mui/material";
import React, { FC } from "react";
import image from "./image.png";

const Race: FC = () => {

    const [progress, setProgress] = React.useState(0);
    const [hideTimer, setHideTimer] = React.useState(false);
    const [hideCard, setHideCard] = React.useState(false);

    function test1() {
        console.log("test1");
    }

    const test2 = () => {
        console.log("test2");
    }



    const startTimer = () => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setHideTimer(true);
                    return 0;
                }
                return prev + 10;
            });
        }, 1000);
        setHideCard(true);
    }


    return (
        <Box display="flex" gap={2} mb={3} mt="100px">
            {!hideCard &&
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image={image}
                        title="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            guide
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            when the race starts, quickly listen to the words and type them in.Have fun and beat your friends!
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={startTimer} >play</Button>
                    </CardActions>
                </Card>
            }
            {!hideTimer &&
                <CircularProgress variant="determinate" value={progress} />
            }
            {hideTimer &&
                <Alert security="success">
                    time is up
                </Alert>
            }
        </Box>
    );
}

export default Race;

