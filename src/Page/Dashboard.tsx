import { useParams } from 'react-router-dom';
import ProfileCard from '../Components/ProfileCard';
import LanguageChart from '../Components/LanguageChart';

export default function Dashboard() {
  const { username } = useParams<{ username: string }>();

  if (!username) {
    return <div>Username is missing in the URL.</div>;
  }

  return (
    <div className="dashboard">
      <h1>GitHub Profile: {username}</h1>
      <div className="grid">
        <ProfileCard username={username} />
        <LanguageChart username={username} />
      </div>
    </div>
  );
}
