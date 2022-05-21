import CampaignPage from '../../components/Campaign/CampaignPage';

export default CampaignPage;

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}
