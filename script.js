'use strict'
let localStream = null;
let peer = null ;
let existingCall = null;

// カメラ映像取得
navigator.mediaDevices.getUserMedia({video: true, audio: true})
  .then( function (stream) {
  // 成功時にvideo要素にカメラ映像をセットし、再生

  $('#my-video').get(0).srcObject = stream;
  localStream = stream;
  }).catch(function(error){
    console.error('mediaDevice.getUserMedia() error:', error);
    return;
  });

  peer = new Peer({
    key: '23dd3897-440e-4c7a-9515-c39be8185baa',
    debug: 3
  });

  peer.on('open', function(){
    $('#my-id').text(peer.id);
  });
  peer.on('error', function(err){
    alert(err.message);
  });
  peer.on('close', function(){
  });
  peer.on('disconnected',function(){
  });
  $('#make-call').submit(function(e){
    e.preventDefault();
    const call = peer.call($('#callto-id').val(), localStream);
    setupCallEventHanders(call);
  });
  $('#end-call').click(function(){
    existingCall.close();
  });
  peer.on('call',function(call){
    call.answer(localStream);
    setupCallEventHanders(call);
  });
  function setupCallEventHanders(call){
    if (existingCall){
        existingCall.close();
          };

    existingCall = call;
    call.on('stream',function(stream){
      addVideo(call.stream);
      setupEndCallUI();
      $('#their-id').text(call.remoteId);
    });
    call.on('close',function(){
      removeVideo(call.remoteId);
      setupMakeCallUI();
    });
  }
  function addVideo(call,stream){
    $('#their-video').get(0).srcObject = stream;
  }
  function removeVideo(peerId){
    $('#their-video').get(0).srcObject = undefined;
  }
  function setupMakeCallUI(){
    $('#make-call').show();
    $('#end-call').hide();
  }

  function setupEndCallUI(){
    $('#make-call').hide();
    $('#end-call').show();
 }
 