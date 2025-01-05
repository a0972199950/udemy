import { type FC } from "react";
import { useParams, Link } from "react-router";

const UsersId: FC = () => {
  const params = useParams();

  return (
    <div>
      user with dynamic id: {params.id}
      <Link to="/users">
        <button>Go to /users</button>
      </Link>
    </div>
  );
};

export default UsersId;
