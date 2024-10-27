import { User } from '../../types/types';

interface Props {
  flaggedUsers: [User],
  setSelectedUser: (user: User) => void;
}


const TableOne = ({ flaggedUsers, setSelectedUser }: Props) => {
  {
    console.log(flaggedUsers);
  }
  const handleClick = (user:User)=>{
    setSelectedUser(user);
    console.log(user);
    
  }
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Flagged Accounts
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Account
            </h5>
          </div>

          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Email
            </h5>
          </div>

          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Last IP Address
            </h5>
          </div>

          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Severity Level
            </h5>
          </div>

          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Suspected Posts
            </h5>
          </div>
        </div>

        {flaggedUsers?.map((user, key) => (
          <div
            className={`grid grid-cols-5 cursor-pointer hover:opacity-30 ${
              key === flaggedUsers.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={key}
            onClick={() => {
              handleClick(user);
            }}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              {/* <div className="flex-shrink-0">
                <img src={brand.logo} alt="Brand" />
              </div> */}
              <p className="hidden text-black dark:text-white sm:block">
                {user.username}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p>{user.email}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p>{user.loginIps[0]}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p
                className={
                  user.flaggedPosts.length + user.flaggedComments.length < 5
                    ? `text-meta-3`
                    : user.flaggedPosts.length + user.flaggedComments.length <
                      10
                    ? `text-meta-6`
                    : `text-meta-1`
                }
              >
                {user.flaggedPosts.length + user.flaggedComments.length < 5
                  ? `Low`
                  : user.flaggedPosts.length + user.flaggedComments.length < 10
                  ? `Medium`
                  : `High`}
              </p>
            </div>

            <div className="items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">
                {user.flaggedPosts.length + user.flaggedComments.length}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
