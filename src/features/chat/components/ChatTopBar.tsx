import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import { MouseEvent, ReactNode } from 'react';

interface ChatTopBarProps {
    sidebarWidth: number;
    onOpenModelSettings: (event: MouseEvent<HTMLElement>) => void;
    modelButtonLabel: string;
    onClearChat: () => void;
    rightSlot?: ReactNode;
}

export function ChatTopBar({
    sidebarWidth,
    onOpenModelSettings,
    modelButtonLabel,
    onClearChat,
    rightSlot,
}: ChatTopBarProps) {
    return (
        <AppBar
            position="fixed"
            color="transparent"
            elevation={0}
            sx={(theme) => ({
                backgroundColor: theme.palette.background.default,
                width: { xs: '100%', sm: `calc(100% - ${sidebarWidth}px)` },
                ml: { xs: 0, sm: `${sidebarWidth}px` },
                borderBottom: `1px solid ${theme.palette.divider}`,
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
            })}
        >
            <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
                <Button
                    variant="text"
                    color="inherit"
                    endIcon={<ExpandMoreIcon />}
                    onClick={onOpenModelSettings}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: 16,
                    }}
                >
                    {modelButtonLabel}
                </Button>

                <Box display="flex" alignItems="center" gap={1.5}>
                    {rightSlot}
                    <Button
                        variant="text"
                        color="primary"
                        sx={(theme) => ({ textTransform: 'none', fontWeight: 600, color: theme.palette.text.primary })}
                        onClick={onClearChat}
                    >
                        Очистить чат
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
