import React, {
  ForwardedRef,
  ReactNode,
  RefObject,
  forwardRef,
  useImperativeHandle,
  useReducer,
  useState,
} from "react";
import "./Teams.scss";
import { ControlRef } from "./Control";

export type TeamsRef = {
  roll: (length: number, count: number, excepts: number[]) => void;
  bestScore: number;
  bestTeams: number[];
  bestMembers: number[];
};

const Teams = forwardRef(
  (
    {
      control,
    }: {
      control: RefObject<ControlRef>;
    },
    ref: ForwardedRef<TeamsRef>
  ) => {
    const [teams, setTeams] = useState<number[][]>([]);
    const [scores, dispatchScores] = useReducer(
      (
        state: number[],
        action:
          | {
              type: "increase" | "decrease";
              i: number;
            }
          | {
              type: "reset";
              size: number;
            }
      ) => {
        const newScores = [...state];
        switch (action.type) {
          case "increase":
            newScores[action.i]++;
            break;
          case "decrease":
            if (newScores[action.i] > 0) {
              newScores[action.i]--;
            }
            break;
          case "reset":
            return Array.from<number>({ length: action.size }).fill(0);
        }
        return newScores;
      },
      []
    );

    useImperativeHandle(ref, () => {
      return {
        roll(length, count, excepts) {
          const cands = Array.from({ length })
            .map((_, i) => i + 1)
            .filter((i) => !excepts.includes(i));

          for (let i = cands.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cands[i], cands[j]] = [cands[j], cands[i]];
          }

          const teams = cands.reduce(
            (t, n, i) => {
              t[i % count].push(n);
              return t;
            },
            Array.from({ length: count }).map<number[]>(() => [])
          );

          setTeams(teams);
          dispatchScores({ type: "reset", size: count });
        },
        get bestScore() {
          return Math.max(...scores);
        },
        get bestTeams() {
          return [...scores.entries()]
            .filter(([_, score]) => score >= this.bestScore)
            .map(([team]) => team);
        },
        get bestMembers() {
          return this.bestTeams.map((team) => teams[team]).flat();
        },
      };
    });

    return (
      <div className="teams">
        {teams.map((team, i) => (
          <Team
            key={i}
            team={team}
            teamId={i + 1}
            names={control?.current?.names ?? []}
            score={scores[i]}
            onIncrease={() => dispatchScores({ type: "increase", i })}
            onDecrease={() => dispatchScores({ type: "decrease", i })}
            icon={control.current?.icon}
          />
        ))}
      </div>
    );
  }
);

function Team({
  team,
  teamId,
  names,
  score,
  onIncrease,
  onDecrease,
  icon = String.fromCharCode(10026),
}: {
  team: number[];
  teamId: number;
  names: { [id: number]: string };
  score: number;
  onIncrease: () => void;
  onDecrease: () => void;
  icon?: ReactNode;
}) {
  return (
    <div className="team">
      <div className="members">
        {team.map((member, i) => (
          <div key={i} className="member">
            {names[member] ?? member}
          </div>
        ))}
      </div>
      <div className="score">
        <div className="score-control">
          <div className="team-id">{teamId}</div>
          <button type="button" onClick={() => onIncrease()}>
            &#65291;
          </button>
          <button
            type="button"
            onClick={() => onDecrease()}
            disabled={score <= 0}
          >
            &#65293;
          </button>
        </div>
        <div className="score-display">
          {Array.from({ length: score }).map((_, i) => (
            <span key={i}>{icon}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Teams;
