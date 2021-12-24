import Head from 'next/head';

interface titleProps {
  title: string;
}

const Title = ({ title }: titleProps) => (
  <Head><title>{`${title} - Epicteller`}</title></Head>
);

export default Title;
