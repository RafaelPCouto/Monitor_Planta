import { useMemo, useState } from 'react'
import usePlantStore from './store/usePlantStore'
import styles from './App.module.css'
import plantsImg from './assets/plants.png'
import dropImg from './assets/drop.png'

// Calcula uma nota entre 0 e 1 com base nos limites de cada sensor.
const scoreRange = (value, { a, b, c, d }) => {
  if (value <= a) return 0
  if (value < b) return (value - a) / (b - a)
  if (value <= c) return 1
  if (value < d) return (d - value) / (d - c)
  return 0
}

const formatPercent = (value) => `${Math.round(value)}%`

function App() {
  const [activeScreen, setActiveScreen] = useState('painel')
  const {
    profiles,
    selectedProfileId,
    sensors,
    irrigation,
    setProfile,
    setIrrigationMode,
    setTargetMoisture,
    setScheduledTime,
    addWatering,
  } = usePlantStore()

  const profile = profiles[selectedProfileId]

  const health = useMemo(() => {
    const thresholds = profile.thresholds
    const scores = [
      scoreRange(sensors.soilMoisture, thresholds.soilMoisture),
      scoreRange(sensors.soilPh, thresholds.soilPh),
      scoreRange(sensors.airHumidity, thresholds.airHumidity),
      scoreRange(sensors.temperature, thresholds.temperature),
      scoreRange(sensors.light, thresholds.light),
    ]
    const total = scores.reduce((sum, score) => sum + score, 0)
    return (total / scores.length) * 100
  }, [profile, sensors])

  const healthStatus = useMemo(() => {
    if (health >= 80) {
      return {
        label: 'Sua planta está feliz!',
        tone: 'good',
      }
    }
    if (health >= 50) {
      return {
        label: 'Sua planta precisa de atenção!',
        tone: 'warn',
      }
    }
    return {
      label: 'Cuidado! Sua planta não está saudável!',
      tone: 'alert',
    }
  }, [health])

  // Simula uma irrigacao manual adicionando ao historico local.
  const handleWaterNow = () => {
    const now = new Date()
    const entry = {
      date: now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }
    addWatering(entry)
  }

  // Evita NaN quando o input fica vazio.
  const handleTargetMoistureChange = (event) => {
    const nextValue = Number(event.target.value)
    setTargetMoisture(Number.isNaN(nextValue) ? 0 : nextValue)
  }

  const healthDegrees = Math.max(0, Math.min(360, Math.round(health * 3.6)))

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>monitor da planta</p>
          <h1 className={styles.title}>Painel ambiental</h1>
          <p className={styles.subtitle}>
            Acompanhe a saúde da sua planta e ajuste a irrigação com base nos sensores.
          </p>
        </div>
        <div className={styles.profileCard}>
          <img src={plantsImg} alt="Planta" />
          <div>
            <span className={styles.profileLabel}>Perfil selecionado</span>
            <strong>{profile.label}</strong>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {activeScreen === 'painel' && (
          <section className={styles.panel}>
            <div className={styles.healthCard}>
              <div
                className={styles.healthGauge}
                data-tone={healthStatus.tone}
                style={{ '--gauge-value': healthDegrees }}
              >
                <span>{formatPercent(health)}</span>
              </div>
              <div>
                <p className={styles.healthTitle}>Saude geral</p>
                <h2 className={styles.healthStatus} data-tone={healthStatus.tone}>
                  {healthStatus.label}
                </h2>
                <p className={styles.healthHint}>
                  Indicador calculado pela faixa ideal de cada sensor.
                </p>
              </div>
            </div>

            <div className={styles.grid}>
              <article className={styles.metricCard}>
                <h3>Solo</h3>
                <div className={styles.metricRow}>
                  <span>Umidade</span>
                  <strong>{formatPercent(sensors.soilMoisture)}</strong>
                </div>
                <div className={styles.metricRow}>
                  <span>pH</span>
                  <strong>{sensors.soilPh}</strong>
                </div>
              </article>
              <article className={styles.metricCard}>
                <h3>Ambiente</h3>
                <div className={styles.metricRow}>
                  <span>Umidade do ar</span>
                  <strong>{formatPercent(sensors.airHumidity)}</strong>
                </div>
                <div className={styles.metricRow}>
                  <span>Temperatura</span>
                  <strong>{sensors.temperature}°C</strong>
                </div>
              </article>
              <article className={styles.metricCard}>
                <h3>Luminosidade</h3>
                <div className={styles.metricRow}>
                  <span>Nivel de luz</span>
                  <strong>{formatPercent(sensors.light)}</strong>
                </div>
                <p className={styles.metricHint}>Ideal para fotossintese.</p>
              </article>
            </div>
          </section>
        )}

        {activeScreen === 'irrigacao' && (
          <section className={styles.irrigation}>
            <div className={styles.irrigationHero}>
              <div>
                <h2>Irrigacao inteligente</h2>
                <p>
                  Alterne entre modos manual, automatico ou agendado para manter o solo equilibrado.
                </p>
              </div>
              <button type="button" className={styles.waterButton} onClick={handleWaterNow}>
                <img src={dropImg} alt="Gota" />
                Regar agora
              </button>
            </div>

            <div className={styles.modeGrid}>
              {[
                { id: 'manual', label: 'Manual' },
                { id: 'automatico', label: 'Automatica' },
                { id: 'agendada', label: 'Agendada' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={styles.modeCard}
                  data-active={irrigation.mode === mode.id}
                  onClick={() => setIrrigationMode(mode.id)}
                >
                  <span>{mode.label}</span>
                  <small>{irrigation.mode === mode.id ? 'Ativo' : 'Toque para ativar'}</small>
                </button>
              ))}
            </div>

            <div className={styles.irrigationDetails}>
              <div className={styles.detailCard}>
                <h3>Umidade alvo</h3>
                <label className={styles.inputField}>
                  <input
                    type="number"
                    value={irrigation.targetMoisture}
                    min="0"
                    max="100"
                    onChange={handleTargetMoistureChange}
                  />
                  <span>%</span>
                </label>
                <p>Recomendado: 55%</p>
              </div>
              <div className={styles.detailCard}>
                <h3>Horario agendado</h3>
                <label className={styles.inputField}>
                  <input
                    type="time"
                    value={irrigation.scheduledTime}
                    onChange={(event) => setScheduledTime(event.target.value)}
                  />
                </label>
                <p>Horario atual do sistema.</p>
              </div>
              <div className={styles.detailCard}>
                <h3>Ultimas regas</h3>
                <ul>
                  {irrigation.lastWaterings.map((item, index) => (
                    <li key={`${item.date}-${item.time}-${index}`}>
                      Dia: {item.date} | Hora: {item.time}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {activeScreen === 'perfis' && (
          <section className={styles.profiles}>
            <div className={styles.profileHeader}>
              <h2>Perfis de cultivo</h2>
              <p>
                Selecione um perfil para ajustar automaticamente as faixas ideais dos sensores.
              </p>
            </div>
            <div className={styles.profileGrid}>
              {Object.values(profiles).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.profileTile}
                  data-active={selectedProfileId === item.id}
                  onClick={() => setProfile(item.id)}
                >
                  <span>{item.label}</span>
                  <small>{selectedProfileId === item.id ? 'Selecionado' : 'Clique para usar'}</small>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      <nav className={styles.nav}>
        <button
          type="button"
          data-active={activeScreen === 'painel'}
          onClick={() => setActiveScreen('painel')}
        >
          Painel
        </button>
        <button
          type="button"
          data-active={activeScreen === 'irrigacao'}
          onClick={() => setActiveScreen('irrigacao')}
        >
          Irrigacao
        </button>
        <button
          type="button"
          data-active={activeScreen === 'perfis'}
          onClick={() => setActiveScreen('perfis')}
        >
          Perfis
        </button>
      </nav>
    </div>
  )
}

export default App
