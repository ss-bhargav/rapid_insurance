import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import styles from './sideNav.module.scss';
import 'react-pro-sidebar/dist/css/styles.css';
import { SideNavMenuItems } from 'helper/constants';
import Link from 'next/link';

const SideNav = () => {
  return (
    <div className={styles.prosidebar}>
      <ProSidebar>
        <Menu iconShape="square">
          {SideNavMenuItems.map((item, index) =>
            item.subMenu ? (
              <SubMenu key={item.subMenu} title={item.subMenu}>
                {item.menuItem.map((menu, index) => {
                  return (
                    <MenuItem key={menu}>
                      <Link href={`${menu.links}`}>{menu.menu}</Link>
                    </MenuItem>
                  );
                })}
              </SubMenu>
            ) : (
              <MenuItem>
                <Link href={`${item.menuItem[0].links}`}>{item.menuItem[0].menu}</Link>
              </MenuItem>
            )
          )}
        </Menu>
      </ProSidebar>
      ;
    </div>
  );
};

export default SideNav;
