import { User } from '../../types/types';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import { Post } from '../../types/types';

interface Props {
  user: User;
  setSelectedUser: (user: User | null) => void;
}

const Posts = ({ user, setSelectedUser }: Props) => {
  {
    console.log(user);
  }
  const handlePost = async (id: String) => {
    try {
      console.log(id);

      const response = await axios.post(
        `http://localhost:3000/api/v1/post/disable`,
        {
          id,
        },
      );
      console.log(response);
      if (response.status !== 200) {
        throw new Error('Failed to disable post');
      }
      setSelectedUser(null);
    } catch (err) {
      setSelectedUser(null);
      throw new Error('Failed to disable post');
    }
  };
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Post Details
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Media Prob.
            </h5>
          </div>

          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Media Description
            </h5>
          </div>

          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Text Prob.
            </h5>
          </div>

          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Text Description
            </h5>
          </div>
        </div>

        {user.flaggedPosts?.map((post, key) => (
          <div
            className={`grid grid-cols-5 ${
              key === user.flaggedPosts.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              {/* <div className="flex-shrink-0">
                <img src={brand.logo} alt="Brand" />
              </div> */}
              <p className=" text-black dark:text-white">
                {post.flagDetails.image.probability}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p>{post.flagDetails.image.description}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p>{post.flagDetails.text.probability}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p>{post.flagDetails.text.description}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              {post.disabled ? (
                <p className="text-red-950">Blocked</p>
              ) : (
                <Trash2
                  onClick={() => handlePost(post._id)}
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>
        ))}
        {user.flaggedComments?.map((comment, key) => (
          <div
            className={`grid grid-cols-5 ${
              key === user.flaggedComments.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              {/* <div className="flex-shrink-0">
                <img src={brand.logo} alt="Brand" />
              </div> */}
              <p className=" text-black dark:text-white">
                {comment.flagDetails.image.probability}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p>{comment.flagDetails.image.description}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p>{comment.flagDetails.text.probability}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p>{comment.flagDetails.text.description}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              {comment.disabled ? (
                <p className="text-red-950">Blocked</p>
              ) : (
                <Trash2
                  onClick={() => handlePost(comment._id)}
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
