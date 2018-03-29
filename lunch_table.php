<div id="lunch-table" class="container">
        <div class="row">
                <div class="col-lg-12">
                        <h1>Lunch scheduler</h1>
                </div>
        </div>
        <div class="form-group row">
                <label for="new-username" class="sr-only">New time slot</label>
                <div class="col-lg-4 col-sm-8">
                        <input type="text" class="form-control" id="new-time-slot" name="new-time-slot" placeholder="New time slot (eg. hh:mm, hhmm should be prime number)" pattern="\d{2}:\d{2}" onblur="this.checkValidity();" />
                </div>
                <button class="btn btn-primary col-lg-2 col-sm-4" onclick="addNewTimeSlot()">Add time slot</button>
        </div>
        <div class="row">
                <div class="col-lg-12">
                        <h2>Participants</h2>
                </div>
        </div>
        <div class="row users">
                <div class="col-lg-12">
                </div>
        </div>
        <div class="row">
                <div class="col-lg-12">
                        <h2>Time slots</h2>
                </div>
        </div>
        <div id="time-slots-container">
        </div>
        <div class="row">
                <div class="col-lg-12">
                        <h2>Comments</h1>
                </div>
        </div>
        <div id="comments-container">
        </div>
        <div class="row">
                <div class="col-sm-10">
                        <textarea id="comment" class="form-control"></textarea>
                </div>
                <button class="btn btn-primary col-sm-2" onclick="sendNewComment()">Send</button>
        </div>
</div>