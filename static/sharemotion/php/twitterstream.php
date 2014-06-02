<?php include 'twitteroauth.php';

try {
	$response = array();
	switch($_GET['action']) {		
		case 'getCount':
			$response = Count::getCount($_GET['hashtag'], $_GET['since_id'], $_GET['date']);
		break;
		default: throw new Exception('Wrong action');
	}
	echo json_encode($response);

} catch(Exception $e) {
	die(json_encode(array('error' => $e->getMessage())));
}

Class Count {
	public static function getCount($hashtag, $since_id, $date) {
		$c = "XYaQXB4C7BYiXjQQdMw";
		$cs = "ipUEDrDMRwlaqZwjoXmQH4Uko6JMO0WCmf76MRha8";
		$a = "2208998839-RWaVzPQ6I961dPo83v2TtdfwQvhbr1TeoFbyqDd";
		$as = "PsBJuYAP0QY0qoGMjBvdPykYxtWPupUDxs1660DRm8E0l";
		$twitter = new TwitterOAuth($c, $cs, $a, $as);

		$query = '?q='.$hashtag.'&since='.$date.'&geocode=25.28,51.53,30km&count=100';
		if ($since_id) {
			$query = $query.'&since_id='.$since_id;
		}
		$response = $twitter->get('https://api.twitter.com/1.1/search/tweets.json'.$query);
		if ($response){
			foreach ($response as $tweets) {
				if (array_key_exists('code', $tweets[0])) {
					$twitter = new TwitterOAuth($c, $cs, $a, $as);
					return null;
				} return $tweets;
			}
		}
		return null;
	}
}

?>