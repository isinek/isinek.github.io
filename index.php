<!DOCTYPE html>
<html lang="en">
<head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Lunch scheduler</title>
        <link rel="stylesheet" type="text/css" href="bootstrap.min.css" />
        <script src="jquery.min.js"></script>
        <script src="jquery-ui.js"></script>
        <script src="bootstrap.min.js"></script>
        <script src="bootstrap.bundle.min.js"></script>
        <script src="js.js"></script>
        <style>
                div.container > div.row {
                        margin-bottom: 10px;
                        padding: 10px 0px;
                }

                span.btn {
                        margin: 4px 2px;
                        z-index: 1;
                }

                input[pattern]:invalid,
                input.invalid {
                        border-color: red;
                }
                div.form-group > * {
                        margin-bottom: 10px;
                }
                div.alert {
                        position: absolute;
                        top: 50px;
                        left: auto;
                        bottom: auto;
                        right: 50px;
                        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.25);
                }
                .btn-default {
                        border-color: #CCC;
                }
                div#comments-container span.btn {
                        width: 100%;
                }
                p.comment {
                        border: 1px solid #CCC;
                        border-radius: .25rem;
                        padding: .375rem .75rem;
                        line-height: 1.5;
                        margin: 4px 2px 1rem;
                }
                textarea#comment {
                        width: 100%;
                        min-height: 40px;
                }
        </style>
</head>
<body>
        <?php if (isset($_COOKIE['userID'])) {
                include('lunch_table.php');
        } else {
                include('login.html');
        }?>
</body>
</html>