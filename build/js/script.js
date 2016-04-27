window.addEventListener('DOMContentLoaded', function () {

  // PouchDB.debug.enable('*');
  PouchDB.debug.disable();
  var db = new PouchDB('pfa2'),
      dbr = new PouchDB('http://localhost:5984/pfa2r');

  db.info().then(function (info) {
    log('db_name: ' + info.db_name);
    log('doc_count: ' + info.doc_count);
  });
  dbr.info().then(function (info) {
    log('db_name: ' + info.db_name);
    log('doc_count: ' + info.doc_count);
  });
  // PouchDB.debug.disable();
  db.sync('http://localhost:5984/pfa2r');


  var $fname = $('#fname'),
      $lname = $('#lname'),
      $email = $('#email'),
      $phone = $('#phone'),
      $subject = $('#subject'),
      $message = $('#message'),
      $submitBtn = $('#submit-btn'),
      $results = $('#results'),
      $refreshBtn = $('#refresh-btn');

  // log($fname);
  // log($lname);
  // log($email);
  // log($phone);
  // log($subject);
  // log($message);
  // log($submitBtn);

  $submitBtn.on('click', function (evt) {
    evt.preventDefault();
    var doc = {
      "_id": $email[0].value,
      "fname": $fname[0].value,
      "lname": $lname[0].value,
      "phone": $phone[0].value,
      "subject": $subject[0].value,
      "message": $message[0].value
    }
    log(doc);
    db.put(doc);
    dbr.put(doc);

    db.get('mario@shortrope.com').then(function (doc) {
      log(doc);
      var output = '<p>';
      output += 'Name: ' + doc.fname + ' ' + doc.lname + '<br>';
      output += 'Email: ' + doc._id + '<br>';
      output += 'Phone: ' + doc.phone + '<br>';
      output += 'Subject: ' + doc.subject + '<br>';
      output += 'Message: ' + doc.message;
      output += '</p>';
      log(output);
      log($results);
      $results.html(output);
      log($results);
    }).catch(function (err) {
      log(err);
    });
    // $fname.val('');
    // $lname.val('');
    // $email.val('');
    // $phone.val('');
    // $subject.val('');
    // $message.val('');
  });

  $refreshBtn.on('click', function (evt) {
    evt.preventDefault();
    populateListView();
  });

  function populateListView() {
    db.allDocs({
      include_docs: true,
      attachments: true
    }).then(function (result) {
      log(result);
      var output, i
      $results.html('');
      for (i = 0; i < result.rows.length; i++) {
        output = '<li><div class="info">';
        output += '<p><i>Name: </i>' + result.rows[i].doc.fname + ' ' + result.rows[i].doc.lname;
        output += '<br><i>Email: </i>' + result.rows[i].doc._id;
        output += '<br><i>Phone: </i>' + result.rows[i].doc.phone + '</p>';
        output += '</div></li>';

        $results.append(output);
      }


    }).catch(function (err) {
      console.log(err);
    });
  }

  // db.changes().on('change', function () {
  //   log('Changes to DB have been made.');
  // })
  //
  // function putFormData() {
  //     log(id);
  //   log($fname.val());
  //   log($lname.val());
  //     db.put({
  //       "_id": (id++).toString(),
  //       "fname": $fname.val().toString(),
  //       "lname": $lname.val().toString()
  //     }).then();
  // }
  // function getDbData() {
  //
  //
  // }

/////////////////////////////////////////////////////////////
//  Functions

  function log(msg) {
    window.console.log(msg);
  }
});
