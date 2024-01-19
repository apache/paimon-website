import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Unified Batch & Streaming',
    Svg: require('bootstrap-icons/icons/shuffle.svg').default,
    description: (
      <>
          Batch writes and reads, streaming updates, changelog producing,
          all supported.
      </>
    ),
  },
  {
    title: 'Data Lake Capabilities',
    Svg: require('bootstrap-icons/icons/water.svg').default,
    description: (
      <>
          Low cost, high reliability, scalable metadata. Apache Paimon has
          every advantage as a data lake storage.
      </>
    ),
  },
  {
    title: 'Various Merge Engines',
    Svg: require('bootstrap-icons/icons/calculator.svg').default,
    description: (
      <>
          Update records however you like. Preserve the last record, do a
          partial update, or aggregate records together, you decide.
      </>
    ),
  },
    {
        title: 'Changelog Producing',
        Svg: require('bootstrap-icons/icons/clipboard2-pulse.svg').default,
        description: (
            <>
                Apache Paimon can produce correct and complete changelog
                from any data source, simplifying your streaming analytics.
            </>
        ),
    },
    {
        title: 'Rich Table Types',
        Svg: require('bootstrap-icons/icons/table.svg').default,
        description: (
            <>
                Aside from primary-key tables, Apache Paimon also supports
                append-only table, providing orderly streaming reading to replace
                the message queue.
            </>
        ),
    },
    {
        title: 'Schema Evolution',
        Svg: require('bootstrap-icons/icons/grid-1x2.svg').default,
        description: (
            <>
                Apache Paimon supports full schema evolution. You can rename
                and reorder columns.
            </>
        ),
    },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--5')} style={{  boxShadow: '3px 3px 3px 3px #d9dadb',  padding: '20px',margin: '0 50px 50px 0'}}>
      <div className="text--center">
          <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3" style={{color: '#0d6efd'}}>{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
      <div className={styles.centered_content}>
          <div className="text--center padding-horiz--md">
              <Heading as="h1">Key Features</Heading>
          </div>
          <section className={styles.features}>
              <div className="container">
                  <div className={styles.row} style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start'}}>
                      {FeatureList.map((props, idx) => (
                              <Feature key={idx} {...props} />
                      ))}
                  </div>
              </div>
          </section>
      </div>
  );
}
