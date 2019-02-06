require 'twilio-ruby'

account_sid = "AC6921a308b4f23c3fedf1052c241a15b7"
auth_token = "a53764958a4dd9c547cbee747929968a"

p account_sid
p auth_token
# set up a client to talk to the Twilio REST API
@client = Twilio::REST::Client.new(account_sid, auth_token)

call = @client.calls.create(
    to: "+18474204201",
    from: "+15005550006",
    url: "http://demo.twilio.com/docs/voice.xml")
puts call.to