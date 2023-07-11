import React, {
  type ForwardedRef,
  type ReactNode,
  type RefObject,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react'
import './Control.scss'
import { type TeamsRef } from './Teams'
import { type Members } from '../utils/loadnsave'

export interface ControlRef {
  names: Record<number, string>
  icon: ReactNode
}

const Control = forwardRef(
  (
    {
      teams,
    }: {
      teams: RefObject<TeamsRef>
    },
    ref: ForwardedRef<ControlRef>
  ) => {
    const [length, setLength] = useState<number>(30)
    const [count, setCount] = useState<number>(6)
    const [except, setExcept] = useState<string>('')

    const [members, setMembers] = useState<Members>({})

    const [icon, setIcon] = useState<{
      type: 'text' | 'image'
      value: string
    }>(() => {
      const icon = localStorage.getItem('icon')
      if (icon == null) {
        return { type: 'text', value: String.fromCharCode(10026) }
      } else {
        return { type: 'image', value: icon }
      }
    })

    useImperativeHandle(ref, () => {
      return {
        get names() {
          return Object.entries(members)
            .map(([member, { name }]) => [member, name])
            .reduce(
              (names, [member, name]) => ({ ...names, [member]: name }),
              {}
            )
        },
        get icon() {
          switch (icon.type) {
            case 'text':
              return icon.value
            case 'image':
              return <img src={icon.value} />
          }
        },
      }
    })

    return (
      <div className="control">
        <input
          type="number"
          value={length}
          onChange={(e) => {
            setLength(+e.target.value)
          }}
        />{' '}
        명 중에{' '}
        <input
          type="text"
          style={{
            width: '20rem',
          }}
          value={except}
          onChange={(e) => {
            setExcept(e.target.value)
          }}
        />{' '}
        얘네 빼고{' '}
        <input
          type="number"
          value={count}
          onChange={(e) => {
            setCount(+e.target.value)
          }}
        />{' '}
        개 팀에 배치합니다.{' '}
        <button
          type="button"
          onClick={() => {
            teams?.current?.roll(
              length,
              count,
              except
                .split(/\s+/g)
                .filter((n) => n)
                .map((n) => +n)
            )
          }}
        >
          배치
        </button>
        <br />
        <button
          type="button"
          onClick={() => {
            if (teams?.current == null) {
              return
            }
            if (teams.current.bestScore <= 0) {
              alert('점수 없음')
              return
            }
            if (
              confirm(
                `${teams.current.bestTeams
                  .map((team) => `${team + 1}팀`)
                  .join(', ')}에 1점 증가`
              )
            ) {
              const newMembers: Members = JSON.parse(JSON.stringify(members))
              teams.current.bestMembers.forEach((member) => {
                if (newMembers[member] != null) {
                  newMembers[member].score++
                }
              })
              setMembers(newMembers)
            }
          }}
        >
          점수 반영
        </button>
        <div className="input score-list">
          점수 현황 보기
          <div>
            <table>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>이름</th>
                  <th>점수</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(members).map((id) => (
                  <tr key={id}>
                    <td>{+id}</td>
                    <td>{members[+id].name}</td>
                    <td>{members[+id].score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <label className="button">
          불러오기
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files?.[0] != null) {
                const file = e.target.files[0]
                const reader = new FileReader()
                reader.addEventListener('load', () => {
                  import('../utils/loadnsave').then(
                    async ({ load }) => {
                      if (reader.result instanceof ArrayBuffer) {
                        const newMembers = await load(reader.result)
                        setLength(
                          Math.max(...Object.keys(newMembers).map((k) => +k))
                        )
                        setMembers(newMembers)
                      }
                    },
                    () => {}
                  )
                })
                reader.readAsArrayBuffer(file)
              }
            }}
            accept="text/csv"
          />
        </label>
        <button
          type="button"
          onClick={() => {
            import('../utils/loadnsave').then(
              async ({ save }) => {
                const content = await save(members)
                const blob = new Blob([content], {
                  type: 'text/csv',
                })
                if (showSaveFilePicker != null) {
                  showSaveFilePicker({
                    excludeAcceptAllOption: true,
                    suggestedName: 'members.csv',
                    types: [
                      {
                        description: 'CSV file',
                        accept: { 'text/csv': ['.csv'] },
                      },
                    ],
                  })
                    .then(async (handler) => await handler.createWritable())
                    .then(async (writable) => {
                      await writable.write(blob).then(async () => {
                        await writable.close()
                      })
                    })
                    .catch(() => {})
                } else {
                  const anchor = document.createElement('a')
                  anchor.download = prompt('파일 이름') ?? 'members.csv'
                  anchor.href = URL.createObjectURL(blob)
                  anchor.click()
                  URL.revokeObjectURL(anchor.href)
                }
              },
              () => {}
            )
          }}
        >
          저장
        </button>
        <label className="button">
          아이콘 설정
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files?.[0] != null) {
                const reader = new FileReader()
                reader.addEventListener('load', () => {
                  if (typeof reader.result === 'string') {
                    setIcon({
                      type: 'image',
                      value: reader.result,
                    })
                    localStorage.setItem('icon', reader.result)
                  }
                })
                reader.readAsDataURL(e.target.files[0])
              } else {
                setIcon({ type: 'text', value: String.fromCharCode(10026) })
                localStorage.removeItem('icon')
              }
            }}
            accept="image/*"
          />
        </label>
      </div>
    )
  }
)

Control.displayName = 'Control'

export default Control
