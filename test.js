curl -s --user 'api:ed2c3f8da14158c9277fd473f4d310a9-e566273b-84c7e25f' \
    https://api.mailgun.net/v3/sandboxc0a416b4717443a59d2c2dcaf988844f.mailgun.org/messages \
    -F from='Excited User <adam.louis28@gmail.com>' \
    -F to=adam.louis28@gmail.com \
    -F to=adam.louis28@gmail.com \
    -F subject='Hello' \
    -F text='Testing some Mailgun awesomeness!'

echo ''
