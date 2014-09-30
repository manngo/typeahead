<?php
	/*	Lookup Post Codes
		================================================
		Usage:	postcodes.php?limit=…&town=…
				town:	begins with [town]
						omitted=>all
				limit:	limit of results
						omimtted=>8
		Returns json encoded array of objects:
				[{locality: …, town: …, postcode: …},
				 …
				]

		This uses a database in postcodes.sqlite.
		Adjust as necessary.
		================================================ */

		$dsn='sqlite:postcodes.sqlite';
		try {
			$pdo=new PDO($dsn);
		}
		catch (PDOException $e) {
			die('oops');
		}

		$town=@$_GET['town'];
		$limit=intval(@$_GET['limit']);
		if($limit<1) $limit=8;

		$sql='SELECT locality,state,pcode
			FROM postcodes
			WHERE locality LIKE ?
			ORDER BY locality, state
			LIMIT 0,?;';
		$pds=$pdo->prepare($sql);
		$pds->execute(array("$town%",$limit)) or die(1);
		$pds->setFetchMode(PDO::FETCH_BOTH);

		$rows=array();
		foreach($pds as $row) $rows[]=array('locality'=>$row[0],'state'=>$row[1],'postcode'=>$row[2]);
#		header("Access-Control-Allow-Origin: *");
		print json_encode($rows);
?>
