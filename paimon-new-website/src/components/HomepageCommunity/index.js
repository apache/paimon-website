import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const CommunityList = [
  {
    title: 'DingTalk Group',
    Svg: require('bootstrap-icons/icons/chat.svg').default,
    url: "https://qr.dingtalk.com/action/joingroup?code=v1,k1,fJQRBU8+v01pdCtcy+G9YJ38RaCV5RVmrrOblhUlQP4=&_dt_no_comment=1&origin=11",
  },
  {
    title: 'Mailing List',
    Svg: require('bootstrap-icons/icons/envelope-open.svg').default,
      url: "https://github.com/apache/incubator-paimon#mailing-lists",
  },
  {
    title: 'Issue Tracking',
    Svg: require('bootstrap-icons/icons/clipboard-check.svg').default,
      url: "https://github.com/apache/incubator-paimon/issues",
  },
];

function Community({Svg, title, url}) {
  return (
      <a href={url} className={clsx('col col--3')}  style={{  border: '1px solid #0d6efd',  padding: '20px',margin: '0 50px 50px 0', textDecoration: 'none'}}>
        <div >
          <div className="text--center" style={{display: 'flex', alignItems: 'center'}}>
            <Svg className={styles.featureSvg} role="img" />
              <Heading as="h3" style={{margin: ' 10px 10px', color: '#0d6efd'}}>{title}</Heading>
          </div>
        </div>
      </a>

  );
}

export default function HomepageCommunity() {
  return (
      <div className={styles.centered_content}>
          <div className="text--center padding-horiz--md" style={{marginTop:'40px'}}>
              <Heading as="h1">Join the Community</Heading>
          </div>
          <section className={styles.features}>
              <div className="container">
                  <div className={styles.row} >
                      {CommunityList.map((props, idx) => (
                          <Community key={idx} {...props} />
                      ))}
                  </div>
              </div>
          </section>
      </div>
  );
}
