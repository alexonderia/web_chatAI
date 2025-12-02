import { useChatSession } from '../chat/hooks/ChatSessionProvider';
const SettingsPanel = () => {
  const {
    systemPrompt,
    setSystemPrompt,
    temperature,
    setTemperature,
    topP,
    setTopP,
    stream,
    setStream,
  } = useChatSession();

  return (
    <section className="card settings">
      <header>
        <p className="label">Настройки запроса</p>
        <p className="muted">Поддерживаются параметры сервера: системный промпт, температура, топ-p, поток.</p>
      </header>

      <label className="label" htmlFor="system-prompt">
        Системный промпт
      </label>
      <textarea
        id="system-prompt"
        className="textarea"
        value={systemPrompt}
        onChange={(event) => setSystemPrompt(event.target.value)}
      />

      <div className="setting-grid">
        <div>
          <label className="label" htmlFor="temperature">
            Температура
          </label>
          <input
            id="temperature"
            className="input"
            type="number"
            min={0}
            max={2}
            step={0.1}
            value={temperature}
            onChange={(event) => setTemperature(Number(event.target.value))}
          />
          <p className="muted">Контролирует креативность модели.</p>
        </div>

        <div>
          <label className="label" htmlFor="topp">
            Top-p
          </label>
          <input
            id="topp"
            className="input"
            type="number"
            min={0}
            max={1}
            step={0.05}
            value={topP}
            onChange={(event) => setTopP(Number(event.target.value))}
          />
          <p className="muted">Вероятностное сечение вывода.</p>
        </div>
      </div>

      <label className="toggle">
        <input type="checkbox" checked={stream} onChange={(event) => setStream(event.target.checked)} />
        <span>Стриминговые ответы</span>
      </label>
    </section>
  );
};

export default SettingsPanel;