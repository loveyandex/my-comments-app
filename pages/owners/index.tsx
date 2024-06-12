import { GetServerSideProps } from "next";
import Link from "next/link";
import axios from "axios";

interface Owner {
  fbid_v2: string;
  full_name: string;
  id: string;
  username: string;
  hd_profile_pic_url_info: {
    url: string;
    width: number;
    height: number;
  };
  is_verified: boolean;
}

interface Props {
  owners: Owner[];
}

const OwnersPage = ({ owners }: Props) => {
  return (
    <div>
      <h1>Owners</h1>
      <div className="owners-list">
        {owners.map((owner) => (
          <div key={owner.id} className="owner-card">
            {/* <img src={owner.hd_profile_pic_url_info.url} alt={owner.username} className="avatar" /> */}
            <div>
              <h3>{owner.full_name} {owner.is_verified && <span className="verified-badge">✔</span>}</h3>
              <p>@{owner.username}</p>
              <Link href={`/comments/creator3/${owner.id}`}>
                <div className="view-comments-button">View Comments</div>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .owners-list {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
        }

        .owner-card {
          background-color: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: 200px;
        }

        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          margin-bottom: 10px;
        }

        .verified-badge {
          color: #1da1f2;
          margin-left: 5px;
        }

        .view-comments-button {
          display: inline-block;
          margin-top: 10px;
          padding: 5px 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 3px;
          text-decoration: none;
        }

        .view-comments-button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/owner'); // Update this URL to your API endpoint
    const owners: Owner[] = response.data.data;
    console.log("owners",owners)

    return {
      props: {
        owners,
      },
    };
  } catch (error) {
    console.error('Error fetching owners:', error);
    return {
      props: {
        owners: [],
      },
    };
  }
};

export default OwnersPage;
