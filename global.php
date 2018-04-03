<?php
        function cmpUsers($a, $b) {
                return strcmp($a['name'], $b['name']);
        }

        function cmpTimeSlots($a, $b) {
                return strcmp($a['label'], $b['label']);
        }

        date_default_timezone_set('UTC');
        $jsonFilename = new DateTime();
        $jsonFilename = $jsonFilename->format('Ymd').'_json.json';
        $jsonData = @file_get_contents($jsonFilename);
        if (!$jsonData) {
                $jsonData = @file_get_contents('json.json');
                $jsonData = json_decode($jsonData, true);
                $jsonFile = fopen($jsonFilename, 'w') or die('Unable to open file!');
                if (flock($jsonFile,LOCK_EX))
                {
                        fwrite($jsonFile, json_encode($jsonData));
                        flock($jsonFile,LOCK_UN);
                }
                fclose($jsonFile);
        }

        if (isset($_COOKIE['userID'])) {
                if (isset($_POST['status']) && $_POST['status']) {
                        $jsonData = json_decode(file_get_contents($jsonFilename), true);
                        echo json_encode($jsonData);
                } elseif (isset($_POST['userID']) && isset($_POST['timeSlotID'])) {
                        $jsonData = file_get_contents($jsonFilename);
                        $jsonData = json_decode($jsonData, true);

                        for ($i = 0; $i < count($jsonData['timeSlots']); ++$i) {
                                if (($key = array_search($_POST['userID'], $jsonData['timeSlots'][$i]['participants'])) !== false) {
                                        unset($jsonData['timeSlots'][$i]['participants'][$key]);
                                }
                                if ($jsonData['timeSlots'][$i]['id'] == $_POST['timeSlotID']) {
                                        $jsonData['timeSlots'][$i]['participants'][] = $_POST['userID'];
                                }
                                $jsonData['timeSlots'][$i]['participants'] = (array) $jsonData['timeSlots'][$i]['participants'];
                        }

                        $jsonFile = fopen($jsonFilename, 'w') or die('Unable to open file!');
                        if (flock($jsonFile,LOCK_EX))
                        {
                                fwrite($jsonFile, json_encode($jsonData));
                                flock($jsonFile,LOCK_UN);
                        }
                        fclose($jsonFile);
                } elseif (isset($_POST['timeslot'])) {
                        $jsonData = file_get_contents($jsonFilename);
                        $jsonData = json_decode($jsonData, true);

                        $exists = false;
                        foreach ($jsonData['timeSlots'] as $key => $value) {
                                if ($value['label'] == $_POST['timeslot']) {
                                        $exists = true;
                                        break;
                                }
                        }

                        if (!$exists) {
                                $newTimeSlot = [];
                                $newTimeSlot['id'] = uniqid();
                                $newTimeSlot['label'] = $_POST['timeslot'];
                                $newTimeSlot['participants'] = [];
                                $jsonData['timeSlots'][] = $newTimeSlot;

                                usort($jsonData['timeSlots'], 'cmpTimeSlots');

                                $jsonFile = fopen($jsonFilename, 'w') or die('Unable to open file!');
                                fwrite($jsonFile, json_encode($jsonData));
                                fclose($jsonFile);

                                $jsonData = file_get_contents('json.json');
                                $jsonData = json_decode($jsonData, true);

                                $jsonData['timeSlots'][] = $newTimeSlot;

                                usort($jsonData['timeSlots'], 'cmpTimeSlots');

                                $jsonFile = fopen('json.json', 'w') or die('Unable to open file!');
                                if (flock($jsonFile,LOCK_EX))
                                {
                                        fwrite($jsonFile, json_encode($jsonData));
                                        flock($jsonFile,LOCK_UN);
                                }
                                fclose($jsonFile);
                        }

                        return 1;
                } elseif (isset($_POST['userID']) && isset($_POST['comment'])) {
                        $jsonData = file_get_contents($jsonFilename);
                        $jsonData = json_decode($jsonData, true);

                        $newComment = [];
                        $newComment['userID'] = $_POST['userID'];
                        $newComment['text'] = str_replace("\n", "<br />", $_POST['comment']);
                        $jsonData['comments'][] = $newComment;

                        $jsonFile = fopen($jsonFilename, 'w') or die('Unable to open file!');
                        if (flock($jsonFile,LOCK_EX))
                        {
                                fwrite($jsonFile, json_encode($jsonData));
                                flock($jsonFile,LOCK_UN);
                        }
                        fclose($jsonFile);

                        return 1;
                }
        } elseif (isset($_POST['username'])) {
                $jsonData = file_get_contents($jsonFilename);
                $jsonData = json_decode($jsonData, true);

                $newUser = [];
                $newUser['id'] = uniqid();
                $newUser['name'] = $_POST['username'];
                $jsonData['users'][] = $newUser;

                usort($jsonData['users'], 'cmpUsers');

                $jsonFile = fopen($jsonFilename, 'w') or die('Unable to open file!');
                if (flock($jsonFile,LOCK_EX))
                {
                        fwrite($jsonFile, json_encode($jsonData));
                        flock($jsonFile,LOCK_UN);
                }
                fclose($jsonFile);

                // $jsonData = file_get_contents('json.json');
                // $jsonData = json_decode($jsonData, true);

                // $jsonData['users'][] = $newUser;

                // usort($jsonData['users'], 'cmpUsers');

                // $jsonFile = fopen('json.json', 'w') or die('Unable to open file!');
                // fwrite($jsonFile, json_encode($jsonData));
                // fclose($jsonFile);

                setcookie('userID', $newUser['id'], time()+28800);

                header('Location: /');
        }
?>