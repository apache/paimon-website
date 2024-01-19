import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageArchitecture from '@site/src/components/HomepageArchitecture';
import HomepageCommunity from '@site/src/components/HomepageCommunity';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" style={{textAlign: 'left', fontSize: '50px'}}>
          Apache Paimon
            <sup>
                <span style={{fontSize: '.25em', backgroundColor: '#0d6efd', color: 'white' ,padding: '5px 10px', borderRadius: '5px', left: '10px', position: 'relative'}}>Incubating</span>
            </sup>
        </Heading>
        <p style={{textAlign: 'left', fontSize: '25px', whiteSpace: 'pre-line'}}>{siteConfig.tagline}</p>
              <div className={styles.dropdown} style={{textAlign: 'left'}}>
                  <select className="button button--secondary button--lg" style={{ width: '200px',backgroundColor: '#0dcaf0'}} name={"ewrsdfds"}>
                      <option selected hidden>Get Started</option>
                      <option value="">Flink</option>
                      <option value="">Spark</option>
                      <option value="">Hive</option>
                      <option value="">Presto</option>
                      <option value="">Trion</option>
                  </select>
                  <Link
                      className="button button--secondary button--lg"
                      to="https://github.com/apache/incubator-paimon" style={{ width: '200px',backgroundColor: '#0dcaf0',left: '30px', position: 'relative'}}
                      target="_self">
                      Source code
                  </Link>
              </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Apache Paimon`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageArchitecture />
        <HomepageFeatures />
        <HomepageCommunity />
      </main>
    </Layout>
  );
}
