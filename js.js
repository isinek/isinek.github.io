jQuery(function () {
        var userID = null;
        document.cookie.split(';').forEach(function (item) {
                if (item.indexOf('userID') >= 0) {
                        userID = item.split('=')[1];
                }
        });

        jQuery('#new-time-slot').parent().next().attr('disabled', 'disabled');
        var primes = [];
        for (var i = 1051; i < 1500; i += 2) {
                if (i%100 > 59) {
                        continue;
                }
                var prime = true;
                for (var j = 3; j < i/2; j += 2) {
                        if (!(i%j)) {
                                prime = false;
                                break;
                        }
                }
                if (prime) {
                        primes.push(i);
                }
        }
        jQuery('#new-time-slot').on('blur', function () {
                jQuery(this).removeClass('invalid');
                var n = parseInt(jQuery(this).val().replace(':', ''));
                jQuery(this).parent().next().attr('disabled', 'disabled');
                if (n > 1050 && n < 1500 && !isNaN(n) && typeof(n) === 'number') {
                        var prime = false, firstPrim = primes[0], secPrim = primes[62];
                        for (var i = 0; i < 63; ++i) {
                                if (n === primes[i]) {
                                        prime = true;
                                        break;
                                } else if (n < primes[i]) {
                                        secPrim = primes[i];
                                        break;
                                }
                                firstPrim = primes[i];
                        }
                        if (!prime) {
                                jQuery(this).addClass('invalid');
                                var alert = jQuery('<div class="alert alert-warning"></div>');
                                alert.html('Number <strong>' + n + '</strong> is not prime number.<br />Acceptable time slots are: <strong>'
                                                + parseInt(firstPrim/100) + ':' + ((firstPrim%100) < 10 ? '0' + (firstPrim%100) : (firstPrim%100))
                                                + '</strong> and <strong>'
                                                + parseInt(secPrim/100) + ':' + ((secPrim%100) < 10 ? '0' + (secPrim%100) : (secPrim%100)) 
                                                + '</strong>');
                                jQuery('body').append(alert);
                                setTimeout(function () {
                                        alert.remove();
                                }, 5000);
                        } else {
                                jQuery(this).parent().next().attr('disabled', false);
                        }
                }
        });

        jQuery('div.row.users').droppable({
                accept: 'span.user',
                drop: function (event, ui) {
                        var tmpUser = ui.draggable.clone();
                        ui.draggable.remove();
                        tmpUser.attr('style', false);
                        tmpUser.draggable({ revert: 'invalid' });
                        tmpUser.removeClass('btn-success');
                        tmpUser.addClass('btn-primary');
                        jQuery(this).find('div.user-container').append(tmpUser);
                        jQuery.ajax({
                                url: '/global.php',
                                method: 'POST',
                                data: { 'userID': userID, 'timeSlotID': null },
                                error: function (ex) {
                                        console.error(ex);
                                }
                        });
                }
        });

        if (jQuery('#lunch-table').length) {
                getLunchData(userID, true);
        }
});

function getLunchData(userID, autoRefresh) {
        jQuery.ajax({
                url: '/global.php',
                method: 'POST',
                data: {'status': 1},
                success: function (data) {
                        var lunchData = JSON.parse(data);

                        var usersContainer = jQuery('div.row.users > div');
                        var newUsersContainer = usersContainer.clone();
                        newUsersContainer.html('');
                        if (lunchData && lunchData['users'].length) {
                                lunchData['users'].forEach(function (item) {
                                        var user = jQuery('<span class="user btn btn-primary" data-userid="' + item['id'] + '">' + item['name'] + '</span>');
                                        if (userID === item['id']) {
                                                user.draggable({ revert: 'invalid' });
                                        }
                                        newUsersContainer.append(user);
                                });
                        }

                        var timeSlotsContainer = jQuery('#time-slots-container');
                        var newTimeSlotsContainer = timeSlotsContainer.clone();
                        newTimeSlotsContainer.html('');
                        if (lunchData && lunchData['timeSlots'].length) {
                                lunchData['timeSlots'].forEach(function (item) {
                                        var timeSlot = jQuery('<div class="row time-slot" data-id="' + item['id'] + '"></div>');
                                        timeSlot.append(jQuery('<div class="col-sm-2"><span class="btn btn-default">' + item['label'] + '</span></div>'));
                                        var timeSlotParticipants = jQuery('<div class="col-sm-8 user-container"></div>');
                                        if (item && item['participants'].length) {
                                                item['participants'].forEach(function (item) {
                                                        var participant = newUsersContainer.find('span.user[data-userid="' + item + '"]');
                                                        if (participant.length) {
                                                                var newParticipant = participant.clone();
                                                                newParticipant.attr('style', false);
                                                                if (item == userID) {
                                                                        newParticipant.draggable({ revert: 'invalid' });
                                                                }
                                                                newParticipant.removeClass('btn-primary');
                                                                newParticipant.addClass('btn-success');
                                                                timeSlotParticipants.append(newParticipant);
                                                                participant.remove();
                                                        }
                                                });
                                        }
                                        timeSlot.append(timeSlotParticipants);
                                        var currentTime = new Date();
                                        var timeSlotTime = new Date();
                                        timeSlotTime.setHours(item['label'].split(':')[0]);
                                        timeSlotTime.setMinutes(item['label'].split(':')[1]);
                                        var timeDiff = timeSlotTime - currentTime;
                                        timeDiff = timeDiff < 0 ? 0 : timeDiff;
                                        timeSlot.append(jQuery('<div class="col-sm-2"><span class="btn btn-' + (timeDiff === 0 ? 'danger': (timeDiff/60000 <= 5? 'warning' : 'info')) + '">' + ('00' + parseInt(timeDiff/3600000)).slice(-2) + ':' + ('00' + parseInt(timeDiff%3600000/60000)).slice(-2) + '</span></div>'));
                                        timeSlot.droppable({
                                                accept: 'span.user',
                                                drop: function (event, ui) {
                                                        var tmpUser = ui.draggable.clone();
                                                        ui.draggable.remove();
                                                        tmpUser.attr('style', false);
                                                        tmpUser.draggable({ revert: 'invalid' });
                                                        tmpUser.removeClass('btn-primary');
                                                        tmpUser.addClass('btn-success');
                                                        jQuery(this).find('div.user-container').append(tmpUser);
                                                        jQuery.ajax({
                                                                url: '/global.php',
                                                                method: 'POST',
                                                                data: { 'userID': userID, 'timeSlotID': jQuery(this).attr('data-id') },
                                                                error: function (ex) {
                                                                        console.error(ex);
                                                                }
                                                        });
                                                }
                                        });

                                        newTimeSlotsContainer.append(timeSlot);
                                });
                        }

                        var commentsContainer = jQuery('#comments-container');
                        var newCommentsContainer = commentsContainer.clone();
                        newCommentsContainer.html('');
                        if (lunchData && lunchData['comments'].length) {
                                lunchData['comments'].forEach(function (item) {
                                        var comment = jQuery('<div class="row"></div>');
                                        var username = '';
                                        for (var i = 0; i < lunchData['users'].length; ++i) {
                                                if (lunchData['users'][i]['id'] === item['userID']) {
                                                        username = lunchData['users'][i]['name'];
                                                        break;
                                                }
                                        }
                                        if (item['userID'] === userID) {
                                                comment.append(jQuery('<div class="col-sm-10"><p class="comment">' + item['text'] + '</p></div>'));
                                                comment.append(jQuery('<div class="col-sm-2"><span class="btn btn-primary">' + username + '</span></div>'));
                                        } else {
                                                comment.append(jQuery('<div class="col-sm-2"><span class="btn btn-primary">' + username + '</span></div>'));
                                                comment.append(jQuery('<div class="col-sm-10"><p class="comment">' + item['text'] + '</p></div>'));
                                        }

                                        newCommentsContainer.append(comment);
                                });
                        }

                        commentsContainer.replaceWith(newCommentsContainer);
                        usersContainer.replaceWith(newUsersContainer);
                        timeSlotsContainer.replaceWith(newTimeSlotsContainer);
                },
                error: function (ex) {
                        console.error(ex);
                }
        });
        if (autoRefresh) {
                setTimeout(function () {
                        getLunchData(userID, true);
                }, 10000);
        }
}

function addNewTimeSlot() {
        var userID = null;
        document.cookie.split(';').forEach(function (item) {
                if (item.indexOf('userID') >= 0) {
                        userID = item.split('=')[1];
                }
        });

        jQuery.ajax({
                url: '/global.php',
                method: 'POST',
                data: {'timeslot': jQuery('#new-time-slot').val()},
                success: function (data) {
                        getLunchData(userID, false);
                },
                error: function (ex) {
                        console.error(ex);
                }
        });
}

function sendNewComment() {
        var userID = null;
        document.cookie.split(';').forEach(function (item) {
                if (item.indexOf('userID') >= 0) {
                        userID = item.split('=')[1];
                }
        });

        jQuery.ajax({
                url: '/global.php',
                method: 'POST',
                data: {'userID': userID, 'comment': jQuery('#comment').val()},
                success: function (data) {
                        jQuery('#comment').val('');
                        getLunchData(userID, false);
                },
                error: function (ex) {
                        console.error(ex);
                }
        });
}