import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import { UserSettingsDialog } from '@/features/settings/UserSettingsDialog';
import { ChatSidebar } from '@/features/chat/components/ChatSidebar';
import { ChatTopBar } from '@/features/chat/components/ChatTopBar';
import { ChatInput } from '@/features/chat/components/ChatInput';
import { ChatThread } from '@/features/chat/components/ChatThread';
import { AdvancedSettingsPopover } from '@/features/chat/components/AdvancedSettingsPopover';
import { ModelSettingsPopover } from '@/features/chat/components/ModelSettingsPopover';
import { useChatPage } from './useChatPage';

export function ChatPage(props: Parameters<typeof useChatPage>[0]) {
  const {
    sidebarOpen,
    drawerWidth,
    collapsedWidth,
    sidebarWidth,
    setSidebarOpen,
    selectedChat,
    chatsWithMeta,
    messages,
    loadingChat,
    sending,
    error,
    currentModel,
    models,
    modelSettingsAnchor,
    advancedSettingsAnchor,
    advancedOpen,
    settingsOpen,
    chatTitleDialogOpen,
    chatTitleValue,
    dialogMode,
    createIncognito,
    incognitoLocked,
    deletingChatId,
    bulkDeleting,
    temperature,
    maxTokens,
    isIncognito,
    scrollAnchorRef,
    scrollContainerRef,
    setChatTitleDialogOpen,
    setChatTitleValue,
    setCreateIncognito,
    setSettingsOpen,
    handleOpenModelSettings,
    handleCloseModelSettings,
    handleOpenAdvancedSettings,
    handleCloseAdvancedSettings,
    handleModelChange,
    handleAdvancedSave,
    handleStartNewChat,
    handleSelectChat,
    handleSubmitChatTitle,
    handleRequestRename,
    handleDeleteChat,
    handleDeleteAllChats,
    handleClearChat,
    handleSendMessage,
  } = useChatPage(props);

  const topBarRightSlot = (
    <Stack direction="row" spacing={1} alignItems="center">
      {isIncognito && !error ? (
        <Chip label="Инкогнито" color="warning" size="small" variant="outlined" />
      ) : null}
      {error ? (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      ) : null}
    </Stack>
  );

  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      })}
    >
      <ChatSidebar
        open={sidebarOpen}
        drawerWidth={drawerWidth}
        collapsedWidth={collapsedWidth}
        chats={chatsWithMeta}
        selectedChat={selectedChat}
        onSelectChat={handleSelectChat}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        onOpenSettings={() => setSettingsOpen(true)}
        onCreateChat={handleStartNewChat}
        onRenameChat={handleRequestRename}
        onDeleteChat={(chat) => handleDeleteChat(chat.id)}
        onDeleteAllChats={handleDeleteAllChats}
        deletingChatId={deletingChatId}
        deletingAll={bulkDeleting}
      />
      <ChatTopBar
        sidebarWidth={sidebarWidth}
        onOpenModelSettings={handleOpenModelSettings}
        modelButtonLabel={currentModel ?? 'Выберите модель'}
        onClearChat={handleClearChat}
        clearDisabled={!selectedChat || sending || loadingChat}
        rightSlot={topBarRightSlot}
      />

      <Box
        component="main"
        sx={(theme) => ({
          position: 'relative',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          px: { xs: 3, md: 6 },
          pt: { xs: 3, md: 6 },
          pb: { xs: 1.5, md: 2 },
          mt: 10,
          ml: { xs: 0, sm: `${sidebarWidth}px` },
          minHeight: `calc(100vh - ${theme.spacing(10)})`,
          overflow: 'hidden',
          boxSizing: 'border-box',
          transition: theme.transitions.create('margin-left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        })}
      >
        <Stack
          spacing={4}
          alignItems="center"
          justifyContent="flex-end"
          sx={{
            flexGrow: 1,
            width: '100%',
            minHeight: 0,
          }}
        >
          <Box
            ref={scrollContainerRef}
            sx={{
              width: '100%',
              maxWidth: 860,
              px: { xs: 2, md: 0 },
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              gap: 3,
            }}
          >
            {loadingChat ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
                <CircularProgress />
              </Stack>
            ) : (
              <>
                <ChatThread messages={messages} />
                <ChatInput onSend={handleSendMessage} disabled={sending || loadingChat} />
                <Box ref={scrollAnchorRef} sx={{ height: 0 }} />
              </>
            )}
          </Box>
        </Stack>
      </Box>

      <ModelSettingsPopover
        anchorEl={modelSettingsAnchor}
        open={Boolean(modelSettingsAnchor)}
        onClose={handleCloseModelSettings}
        model={currentModel}
        models={models}
        onModelChange={handleModelChange}
        onOpenAdvanced={handleOpenAdvancedSettings}
        advancedOpen={advancedOpen}
      />

      <AdvancedSettingsPopover
        anchorEl={advancedSettingsAnchor}
        open={advancedOpen}
        onClose={handleCloseAdvancedSettings}
        temperature={temperature}
        maxTokens={maxTokens}
        onSave={handleAdvancedSave}
      />

      <UserSettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <Dialog
        open={chatTitleDialogOpen}
        onClose={() => setChatTitleDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>{dialogMode === 'create' ? 'Новый чат' : 'Переименовать чат'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Название чата"
            value={chatTitleValue}
            onChange={(event) => setChatTitleValue(event.target.value)}
            sx={{ mt: 1 }}
          />
          {dialogMode === 'create' ? (
            <Stack direction="column" spacing={0.5} sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={createIncognito}
                    onChange={(event) => setCreateIncognito(event.target.checked)}
                    disabled={incognitoLocked}
                  />
                }
                label="Создать инкогнито чат"
              />
              <FormHelperText sx={{ ml: 1.5 }}>
                Сообщения инкогнито-чата не сохраняются и будут недоступны после закрытия.
              </FormHelperText>
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChatTitleDialogOpen(false)} disabled={sending}>
            Отмена
          </Button>
          <Button onClick={handleSubmitChatTitle} variant="contained" disabled={sending}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ChatPage;