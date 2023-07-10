import React, { ForwardedRef, ReactNode, RefObject, forwardRef, useImperativeHandle, useState } from "react";
import "./Control.scss";
import { TeamsRef } from "./Teams";
import { decode, encode } from 'iconv-lite';
import { Buffer } from 'buffer/';

export type ControlRef = {
  names: {
    [id: number]: string;
  },
  icon: ReactNode,
};

const Control = forwardRef(({
  teams,
}: {
  teams: RefObject<TeamsRef>,
}, ref: ForwardedRef<ControlRef>) => {
  const [length, setLength] = useState<number>(30);
  const [count, setCount] = useState<number>(6);
  const [except, setExcept] = useState<string>("");

  const [members, setMembers] = useState<{
    [id: number]: {
      name: string,
      score: number,
    };
  }>({});

  const [icon, setIcon] = useState<{
    type: 'text' | 'image',
    value: string,
  }>(() => {
    const icon = localStorage.getItem('icon');
    if (icon == undefined) {
      return { type: 'text', value: String.fromCharCode(10026) };
    } else {
      return { type: 'image', value: icon };
    }
  });

  useImperativeHandle(ref, () => {
    return {
      get names() {
        return Object.entries(members).map(([member, { name }]) => [member, name]).reduce((names, [member, name]) => ({ ...names, [member]: name }), {});
      },
      get icon() {
        switch (icon.type) {
          case 'text':
            return icon.value;
          case 'image':
            return <img src={icon.value} />;
        }
      },
    }
  });

  return (
    <div className="control">
      <input type="number" value={length} onChange={e => setLength(+e.target.value)} /> 명 중에
      <input type="text" style={{
        width: "20rem",
      }} value={except} onChange={e => setExcept(e.target.value)} /> 얘네 빼고
      <input type="number" value={count} onChange={e => setCount(+e.target.value)} /> 개 팀에 배치합니다.
      <button type="button" onClick={() => {
        teams?.current?.roll(length, count, except.split(/\s+/g).filter(n => n).map(n => +n));
      }}>배치</button>
      <br />
      <button type="button" onClick={() => {
        if (teams?.current == undefined) {
          return;
        }
        if (teams.current.bestScore <= 0) {
          alert("점수 없음");
          return;
        }
        if (confirm(`${teams.current.bestTeams.map(team => `${team + 1}팀`).join(', ')}에 1점 증가`)) {
          const newMembers: {
            [id: number]: {
              name: string,
              score: number,
            };
          } = JSON.parse(JSON.stringify(members));
          teams.current.bestMembers.forEach(member => {
            if (newMembers[member]) {
              newMembers[member].score++;
            }
          });
          setMembers(newMembers);
        }
      }}>점수 반영</button>
      <div className="input score-list">점수 현황 보기
        <div>
          <table>
            <thead>
              <th>번호</th>
              <th>이름</th>
              <th>점수</th>
            </thead>
            <tbody>
              {Object.keys(members).map(id => (
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
      <label className="button">불러오기<input type="file" onChange={e => {
        const file = e.target.files && e.target.files[0];
        if (file != undefined) {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            if (reader.result instanceof ArrayBuffer) {
              const data = decode(Buffer.from(new Uint8Array(reader.result)), 'euc-kr').split(/\r?\n/g).map(line => line.split(/[,;\t]/g).map(a => a.trim())).filter(data => data[0].length > 0).map(data => ({ name: data[0], score: +data[1] || 0 }));
              setLength(data.length);
              const newMembers: {
                [id: number]: {
                  name: string,
                  score: number,
                };
              } = {};
              data.forEach((data, i) => newMembers[i + 1] = data);
              setMembers(newMembers);
            }
          });
          reader.readAsArrayBuffer(file);
        } else {
        }
      }} accept="text/csv" /></label>
      <button type="button" onClick={() => {
        const content = Object.entries(members).reduce<string[]>((members, [id, { name, score }]) => {
          members[+id] = `${name},${score}`;
          return members;
        }, []).join('\r\n');
        const blob = new Blob([encode(content, 'euc-kr')], { type: 'text/csv' });
        if (window.showSaveFilePicker != undefined) {
          window.showSaveFilePicker({
            excludeAcceptAllOption: true,
            suggestedName: 'members.csv',
            types: [
              {
                description: 'CSV file',
                accept: { 'text/csv': ['.csv'] }
              }
            ]
          }).then(handler => handler.createWritable()).then(writable => writable.write(blob).then(() => writable.close())).catch(() => { });
        } else {
          const anchor = document.createElement('a');
          anchor.download = prompt('파일 이름') || 'members.csv';
          anchor.href = URL.createObjectURL(blob);
          anchor.click();
          URL.revokeObjectURL(anchor.href);
        }
      }}>저장</button>
      <label className="button">아이콘 설정<input type="file" onChange={e => {
        if (e.target.files?.length && e.target.files?.length > 0) {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            if (reader.result != undefined) {
              setIcon({ type: 'image', value: reader.result?.toString() });
              localStorage.setItem('icon', reader.result.toString());
            }
          });
          reader.readAsDataURL(e.target.files[0]);
        } else {
          setIcon({ type: 'text', value: String.fromCharCode(10026) });
          localStorage.removeItem('icon');
        }
      }} accept="image/*" /></label>
    </div>
  );
});

export default Control;