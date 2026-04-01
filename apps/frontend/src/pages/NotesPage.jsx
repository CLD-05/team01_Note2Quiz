import { useState } from 'react';
import client from '../api/client';

export default function NotesPage() {
  const [response, setResponse] = useState('');

  const handleTest = async () => {
    try {
      const res = await client.get('/test');
      setResponse(res.data);
    } catch (err) {
      setResponse('요청 실패: ' + err.message);
    }
  };

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">노트 목록</h1>
      <p className="text-gray-500">참고 시안: notes.html</p>
      <p className="mt-4 text-sm text-gray-400">이 페이지는 placeholder입니다.</p>

      <button onClick={handleTest} className="bg-primary text-white px-6 py-2 rounded-lg">
        API 연결 테스트
      </button>
      {response && <p className="text-lg">{response}</p>}
    </div>
  );
}
