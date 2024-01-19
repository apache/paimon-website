import Heading from '@theme/Heading';
import styles from './styles.module.css';
import architectureImage from '@site/static/img/architecture.png';



function Architecture({Svg, title}) {
  return (
    <div className={styles.centered_content}>
        <div className="text--center padding-horiz--md">
            <Heading as="h1">{title}</Heading>
        </div>
      <div className="text--center">
          <img src={Svg} alt="Architecture" className={styles.featureSvg}  />
      </div>
    </div>
  );
}

export default function HomepageArchitecture() {
  return (
      <Architecture Svg={architectureImage} title={"One Storage for All Your Data"}/>
  );
}
