import Image from 'next/image';
import Avatar from 'public/avatar.png';
import styles from './header.module.scss';
const HeaderProfile = () => {
  const obj = {
    name: 'Ravi',
    email: 'saikumar@gmail.com',
    location: 'hyderabad',
    contact: 9848913140,
  };
  return (
    <>
      <div className={styles.profile_sec}>
        <div className="d-flex align-items-center mr-3 justify-content-center justify-md-content-between">
          <Image src={Avatar} alt="profile image" height={65} width={70} style={{ borderRadius: '60%' }} />
          <h6 className="mr-2">
            {obj.name}
            <br />
            <small style={{ fontWeight: '600' }}>POS : 12345</small>
          </h6>
        </div>
        <div className={styles.pos_details}>
          <h6>Location : {obj.location?.toLocaleUpperCase()} </h6>
          <h6>Contact : {obj.contact} </h6>
          <h6>Email : {obj.email}</h6>
        </div>
      </div>
      <hr className="m-0" />
    </>
  );
};

export default HeaderProfile;
