$(function(){

    var perPage = 100
    var baseURL = "https://api.github.com/repos/";

    /* This fucntion makes the a */
    function getIssues(url, daysBefore, page, cb) {
        var since = new Date().getTime() - (24 * 3600 * 1000 * daysBefore);
        var queryString = "state=open&page="+page+"&per_page=" + perPage + (daysBefore ? "&since=" + new Date(since).toISOString(): "");
        $.get( url + "?" + queryString, function(resp) {
            cb(resp)
        })
        .fail(function(err) {
          cb(0, {error: err});
        })
    }

    //This function iterates until it gets the complete list of issues.
    //The max count in a api is 100
    function getIssuesCount(url,daysBefore, page, count, cb) {
        getIssues(url, daysBefore, page, function(resp, err) {
          if (err) {
              cb(0, err);
              return false;
          }
          count += resp.length;
          if (resp.length == perPage) {
              //Get the next page
              getIssuesCount(url, daysBefore, ++page, count, cb);
          } else {
              cb(count);
          }
        });
    }

    /* handles the error if we are unable to fetch the data from the github repository */
    function handleError(err) {
        $("#error").show();
        $("#error").html(JSON.parse(err.error.responseText).message);
        $('#issueListTable').hide();
        $('#submitUrl').text("Submit");
        $('#submitUrl').prop('disabled', false);
    }

    function clearIssues(){
      $('#noOpenIssues').html("");
      $('#noYestOpenIssues').html("");
      $('#noSevendDaysOpenIssues').html("");
      $('#noOldOpenIssues').html("");
    }

    /* loads the issue data to the table for the passed in URL */
    function loadDataForURL(url){

      /* clear the existing data if exists */
      clearIssues();

      $('#issueListTable').show();
      $('#giturlfetched').html($("#giturl").val());

      getIssuesCount(url, 0, 1, 0, function(totalIssues, err){
          if (err) {
              handleError(err);
              return false;
          }
          $("#error").hide();
          $('#noOpenIssues').html(totalIssues);
          getIssuesCount(url, 1, 1, 0,function(yesterdatIssue, err){
              if (err) {
                  handleError(err)
                  return false;
              }
              $('#noYestOpenIssues').html(yesterdatIssue);
              getIssuesCount(url, 7, 1, 0, function(sevendaysoldissues, err){
                  if (err) {
                    handleError(err);
                    return false;
                  }
                  $('#noSevendDaysOpenIssues').html(sevendaysoldissues - yesterdatIssue);
                  $('#noOldOpenIssues').html(totalIssues - sevendaysoldissues);

                  $('#submitUrl').text("Submit");
                  $('#submitUrl').prop('disabled', false);
              })
          })
      })

    }

    /* function to check whether the URL is valid or not */
    function isUrlValid(url) {
        return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
    }
    /* handles the submit button click event */
    $('#submitUrl').on('click', function(ev) {
        ev.preventDefault();
        $("#error").hide();

        /* remove the trailing slash */
        var url = $("#giturl").val();
        url = url.slice(-1) == '/'? url.slice(0,-1):url;

        if(!isUrlValid(url))
        {
            alert("Please input a valid URL to proceed.");
            return;
        }

        $('#submitUrl').text("Loading...");
        $('#submitUrl').prop('disabled', true);

        var repodetails = (url.split('/').slice(-2));
        var url = baseURL+repodetails[0]+"/"+repodetails[1]+"/issues"
        loadDataForURL(url);

    })
});
