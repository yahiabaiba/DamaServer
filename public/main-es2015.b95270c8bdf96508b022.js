;(window.webpackJsonp = window.webpackJsonp || []).push([
  [1],
  {
    0: function (t, e, n) {
      t.exports = n('zUnb')
    },
    zUnb: function (t, e, n) {
      'use strict'
      function r (t) {
        return 'function' == typeof t
      }
      n.r(e)
      let s = !1
      const i = {
        Promise: void 0,
        set useDeprecatedSynchronousErrorHandling (t) {
          if (t) {
            const t = new Error()
            console.warn(
              'DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' +
                t.stack
            )
          } else
            s &&
              console.log(
                'RxJS: Back to a better error behavior. Thank you. <3'
              )
          s = t
        },
        get useDeprecatedSynchronousErrorHandling () {
          return s
        }
      }
      function o (t) {
        setTimeout(() => {
          throw t
        }, 0)
      }
      const a = {
          closed: !0,
          next (t) {},
          error (t) {
            if (i.useDeprecatedSynchronousErrorHandling) throw t
            o(t)
          },
          complete () {}
        },
        l = (() => Array.isArray || (t => t && 'number' == typeof t.length))()
      function u (t) {
        return null !== t && 'object' == typeof t
      }
      const c = (() => {
        function t (t) {
          return (
            Error.call(this),
            (this.message = t
              ? `${t.length} errors occurred during unsubscription:\n${t
                  .map((t, e) => `${e + 1}) ${t.toString()}`)
                  .join('\n  ')}`
              : ''),
            (this.name = 'UnsubscriptionError'),
            (this.errors = t),
            this
          )
        }
        return (t.prototype = Object.create(Error.prototype)), t
      })()
      let h = (() => {
        class t {
          constructor (t) {
            ;(this.closed = !1),
              (this._parentOrParents = null),
              (this._subscriptions = null),
              t && (this._unsubscribe = t)
          }
          unsubscribe () {
            let e
            if (this.closed) return
            let {
              _parentOrParents: n,
              _unsubscribe: s,
              _subscriptions: i
            } = this
            if (
              ((this.closed = !0),
              (this._parentOrParents = null),
              (this._subscriptions = null),
              n instanceof t)
            )
              n.remove(this)
            else if (null !== n)
              for (let t = 0; t < n.length; ++t) n[t].remove(this)
            if (r(s))
              try {
                s.call(this)
              } catch (o) {
                e = o instanceof c ? d(o.errors) : [o]
              }
            if (l(i)) {
              let t = -1,
                n = i.length
              for (; ++t < n; ) {
                const n = i[t]
                if (u(n))
                  try {
                    n.unsubscribe()
                  } catch (o) {
                    ;(e = e || []),
                      o instanceof c ? (e = e.concat(d(o.errors))) : e.push(o)
                  }
              }
            }
            if (e) throw new c(e)
          }
          add (e) {
            let n = e
            if (!e) return t.EMPTY
            switch (typeof e) {
              case 'function':
                n = new t(e)
              case 'object':
                if (
                  n === this ||
                  n.closed ||
                  'function' != typeof n.unsubscribe
                )
                  return n
                if (this.closed) return n.unsubscribe(), n
                if (!(n instanceof t)) {
                  const e = n
                  ;(n = new t()), (n._subscriptions = [e])
                }
                break
              default:
                throw new Error(
                  'unrecognized teardown ' + e + ' added to Subscription.'
                )
            }
            let { _parentOrParents: r } = n
            if (null === r) n._parentOrParents = this
            else if (r instanceof t) {
              if (r === this) return n
              n._parentOrParents = [r, this]
            } else {
              if (-1 !== r.indexOf(this)) return n
              r.push(this)
            }
            const s = this._subscriptions
            return null === s ? (this._subscriptions = [n]) : s.push(n), n
          }
          remove (t) {
            const e = this._subscriptions
            if (e) {
              const n = e.indexOf(t)
              ;-1 !== n && e.splice(n, 1)
            }
          }
        }
        return (
          (t.EMPTY = (function (t) {
            return (t.closed = !0), t
          })(new t())),
          t
        )
      })()
      function d (t) {
        return t.reduce((t, e) => t.concat(e instanceof c ? e.errors : e), [])
      }
      const p = (() =>
        'function' == typeof Symbol
          ? Symbol('rxSubscriber')
          : '@@rxSubscriber_' + Math.random())()
      class f extends h {
        constructor (t, e, n) {
          switch (
            (super(),
            (this.syncErrorValue = null),
            (this.syncErrorThrown = !1),
            (this.syncErrorThrowable = !1),
            (this.isStopped = !1),
            arguments.length)
          ) {
            case 0:
              this.destination = a
              break
            case 1:
              if (!t) {
                this.destination = a
                break
              }
              if ('object' == typeof t) {
                t instanceof f
                  ? ((this.syncErrorThrowable = t.syncErrorThrowable),
                    (this.destination = t),
                    t.add(this))
                  : ((this.syncErrorThrowable = !0),
                    (this.destination = new g(this, t)))
                break
              }
            default:
              ;(this.syncErrorThrowable = !0),
                (this.destination = new g(this, t, e, n))
          }
        }
        [p] () {
          return this
        }
        static create (t, e, n) {
          const r = new f(t, e, n)
          return (r.syncErrorThrowable = !1), r
        }
        next (t) {
          this.isStopped || this._next(t)
        }
        error (t) {
          this.isStopped || ((this.isStopped = !0), this._error(t))
        }
        complete () {
          this.isStopped || ((this.isStopped = !0), this._complete())
        }
        unsubscribe () {
          this.closed || ((this.isStopped = !0), super.unsubscribe())
        }
        _next (t) {
          this.destination.next(t)
        }
        _error (t) {
          this.destination.error(t), this.unsubscribe()
        }
        _complete () {
          this.destination.complete(), this.unsubscribe()
        }
        _unsubscribeAndRecycle () {
          const { _parentOrParents: t } = this
          return (
            (this._parentOrParents = null),
            this.unsubscribe(),
            (this.closed = !1),
            (this.isStopped = !1),
            (this._parentOrParents = t),
            this
          )
        }
      }
      class g extends f {
        constructor (t, e, n, s) {
          let i
          super(), (this._parentSubscriber = t)
          let o = this
          r(e)
            ? (i = e)
            : e &&
              ((i = e.next),
              (n = e.error),
              (s = e.complete),
              e !== a &&
                ((o = Object.create(e)),
                r(o.unsubscribe) && this.add(o.unsubscribe.bind(o)),
                (o.unsubscribe = this.unsubscribe.bind(this)))),
            (this._context = o),
            (this._next = i),
            (this._error = n),
            (this._complete = s)
        }
        next (t) {
          if (!this.isStopped && this._next) {
            const { _parentSubscriber: e } = this
            i.useDeprecatedSynchronousErrorHandling && e.syncErrorThrowable
              ? this.__tryOrSetError(e, this._next, t) && this.unsubscribe()
              : this.__tryOrUnsub(this._next, t)
          }
        }
        error (t) {
          if (!this.isStopped) {
            const { _parentSubscriber: e } = this,
              { useDeprecatedSynchronousErrorHandling: n } = i
            if (this._error)
              n && e.syncErrorThrowable
                ? (this.__tryOrSetError(e, this._error, t), this.unsubscribe())
                : (this.__tryOrUnsub(this._error, t), this.unsubscribe())
            else if (e.syncErrorThrowable)
              n ? ((e.syncErrorValue = t), (e.syncErrorThrown = !0)) : o(t),
                this.unsubscribe()
            else {
              if ((this.unsubscribe(), n)) throw t
              o(t)
            }
          }
        }
        complete () {
          if (!this.isStopped) {
            const { _parentSubscriber: t } = this
            if (this._complete) {
              const e = () => this._complete.call(this._context)
              i.useDeprecatedSynchronousErrorHandling && t.syncErrorThrowable
                ? (this.__tryOrSetError(t, e), this.unsubscribe())
                : (this.__tryOrUnsub(e), this.unsubscribe())
            } else this.unsubscribe()
          }
        }
        __tryOrUnsub (t, e) {
          try {
            t.call(this._context, e)
          } catch (n) {
            if ((this.unsubscribe(), i.useDeprecatedSynchronousErrorHandling))
              throw n
            o(n)
          }
        }
        __tryOrSetError (t, e, n) {
          if (!i.useDeprecatedSynchronousErrorHandling)
            throw new Error('bad call')
          try {
            e.call(this._context, n)
          } catch (r) {
            return i.useDeprecatedSynchronousErrorHandling
              ? ((t.syncErrorValue = r), (t.syncErrorThrown = !0), !0)
              : (o(r), !0)
          }
          return !1
        }
        _unsubscribe () {
          const { _parentSubscriber: t } = this
          ;(this._context = null),
            (this._parentSubscriber = null),
            t.unsubscribe()
        }
      }
      const m = (() =>
        ('function' == typeof Symbol && Symbol.observable) || '@@observable')()
      function y (t) {
        return t
      }
      function v (...t) {
        return _(t)
      }
      function _ (t) {
        return 0 === t.length
          ? y
          : 1 === t.length
          ? t[0]
          : function (e) {
              return t.reduce((t, e) => e(t), e)
            }
      }
      let w = (() => {
        class t {
          constructor (t) {
            ;(this._isScalar = !1), t && (this._subscribe = t)
          }
          lift (e) {
            const n = new t()
            return (n.source = this), (n.operator = e), n
          }
          subscribe (t, e, n) {
            const { operator: r } = this,
              s = (function (t, e, n) {
                if (t) {
                  if (t instanceof f) return t
                  if (t[p]) return t[p]()
                }
                return t || e || n ? new f(t, e, n) : new f(a)
              })(t, e, n)
            if (
              (s.add(
                r
                  ? r.call(s, this.source)
                  : this.source ||
                    (i.useDeprecatedSynchronousErrorHandling &&
                      !s.syncErrorThrowable)
                  ? this._subscribe(s)
                  : this._trySubscribe(s)
              ),
              i.useDeprecatedSynchronousErrorHandling &&
                s.syncErrorThrowable &&
                ((s.syncErrorThrowable = !1), s.syncErrorThrown))
            )
              throw s.syncErrorValue
            return s
          }
          _trySubscribe (t) {
            try {
              return this._subscribe(t)
            } catch (e) {
              i.useDeprecatedSynchronousErrorHandling &&
                ((t.syncErrorThrown = !0), (t.syncErrorValue = e)),
                (function (t) {
                  for (; t; ) {
                    const { closed: e, destination: n, isStopped: r } = t
                    if (e || r) return !1
                    t = n && n instanceof f ? n : null
                  }
                  return !0
                })(t)
                  ? t.error(e)
                  : console.warn(e)
            }
          }
          forEach (t, e) {
            return new (e = b(e))((e, n) => {
              let r
              r = this.subscribe(
                e => {
                  try {
                    t(e)
                  } catch (s) {
                    n(s), r && r.unsubscribe()
                  }
                },
                n,
                e
              )
            })
          }
          _subscribe (t) {
            const { source: e } = this
            return e && e.subscribe(t)
          }
          [m] () {
            return this
          }
          pipe (...t) {
            return 0 === t.length ? this : _(t)(this)
          }
          toPromise (t) {
            return new (t = b(t))((t, e) => {
              let n
              this.subscribe(
                t => (n = t),
                t => e(t),
                () => t(n)
              )
            })
          }
        }
        return (t.create = e => new t(e)), t
      })()
      function b (t) {
        if ((t || (t = i.Promise || Promise), !t))
          throw new Error('no Promise impl found')
        return t
      }
      const C = (() => {
        function t () {
          return (
            Error.call(this),
            (this.message = 'object unsubscribed'),
            (this.name = 'ObjectUnsubscribedError'),
            this
          )
        }
        return (t.prototype = Object.create(Error.prototype)), t
      })()
      class S extends h {
        constructor (t, e) {
          super(), (this.subject = t), (this.subscriber = e), (this.closed = !1)
        }
        unsubscribe () {
          if (this.closed) return
          this.closed = !0
          const t = this.subject,
            e = t.observers
          if (
            ((this.subject = null),
            !e || 0 === e.length || t.isStopped || t.closed)
          )
            return
          const n = e.indexOf(this.subscriber)
          ;-1 !== n && e.splice(n, 1)
        }
      }
      class x extends f {
        constructor (t) {
          super(t), (this.destination = t)
        }
      }
      let E = (() => {
        class t extends w {
          constructor () {
            super(),
              (this.observers = []),
              (this.closed = !1),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null)
          }
          [p] () {
            return new x(this)
          }
          lift (t) {
            const e = new T(this, this)
            return (e.operator = t), e
          }
          next (t) {
            if (this.closed) throw new C()
            if (!this.isStopped) {
              const { observers: e } = this,
                n = e.length,
                r = e.slice()
              for (let s = 0; s < n; s++) r[s].next(t)
            }
          }
          error (t) {
            if (this.closed) throw new C()
            ;(this.hasError = !0), (this.thrownError = t), (this.isStopped = !0)
            const { observers: e } = this,
              n = e.length,
              r = e.slice()
            for (let s = 0; s < n; s++) r[s].error(t)
            this.observers.length = 0
          }
          complete () {
            if (this.closed) throw new C()
            this.isStopped = !0
            const { observers: t } = this,
              e = t.length,
              n = t.slice()
            for (let r = 0; r < e; r++) n[r].complete()
            this.observers.length = 0
          }
          unsubscribe () {
            ;(this.isStopped = !0), (this.closed = !0), (this.observers = null)
          }
          _trySubscribe (t) {
            if (this.closed) throw new C()
            return super._trySubscribe(t)
          }
          _subscribe (t) {
            if (this.closed) throw new C()
            return this.hasError
              ? (t.error(this.thrownError), h.EMPTY)
              : this.isStopped
              ? (t.complete(), h.EMPTY)
              : (this.observers.push(t), new S(this, t))
          }
          asObservable () {
            const t = new w()
            return (t.source = this), t
          }
        }
        return (t.create = (t, e) => new T(t, e)), t
      })()
      class T extends E {
        constructor (t, e) {
          super(), (this.destination = t), (this.source = e)
        }
        next (t) {
          const { destination: e } = this
          e && e.next && e.next(t)
        }
        error (t) {
          const { destination: e } = this
          e && e.error && this.destination.error(t)
        }
        complete () {
          const { destination: t } = this
          t && t.complete && this.destination.complete()
        }
        _subscribe (t) {
          const { source: e } = this
          return e ? this.source.subscribe(t) : h.EMPTY
        }
      }
      function k (t) {
        return t && 'function' == typeof t.schedule
      }
      class A extends f {
        constructor (t, e, n) {
          super(),
            (this.parent = t),
            (this.outerValue = e),
            (this.outerIndex = n),
            (this.index = 0)
        }
        _next (t) {
          this.parent.notifyNext(
            this.outerValue,
            t,
            this.outerIndex,
            this.index++,
            this
          )
        }
        _error (t) {
          this.parent.notifyError(t, this), this.unsubscribe()
        }
        _complete () {
          this.parent.notifyComplete(this), this.unsubscribe()
        }
      }
      const O = t => e => {
        for (let n = 0, r = t.length; n < r && !e.closed; n++) e.next(t[n])
        e.complete()
      }
      function I () {
        return 'function' == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : '@@iterator'
      }
      const M = I(),
        P = t => t && 'number' == typeof t.length && 'function' != typeof t
      function R (t) {
        return (
          !!t && 'function' != typeof t.subscribe && 'function' == typeof t.then
        )
      }
      const N = t => {
        if (t && 'function' == typeof t[m])
          return (
            (r = t),
            t => {
              const e = r[m]()
              if ('function' != typeof e.subscribe)
                throw new TypeError(
                  'Provided object does not correctly implement Symbol.observable'
                )
              return e.subscribe(t)
            }
          )
        if (P(t)) return O(t)
        if (R(t))
          return (
            (n = t),
            t => (
              n
                .then(
                  e => {
                    t.closed || (t.next(e), t.complete())
                  },
                  e => t.error(e)
                )
                .then(null, o),
              t
            )
          )
        if (t && 'function' == typeof t[M])
          return (
            (e = t),
            t => {
              const n = e[M]()
              for (;;) {
                const e = n.next()
                if (e.done) {
                  t.complete()
                  break
                }
                if ((t.next(e.value), t.closed)) break
              }
              return (
                'function' == typeof n.return &&
                  t.add(() => {
                    n.return && n.return()
                  }),
                t
              )
            }
          )
        {
          const e = u(t) ? 'an invalid object' : `'${t}'`
          throw new TypeError(
            `You provided ${e} where a stream was expected.` +
              ' You can provide an Observable, Promise, Array, or Iterable.'
          )
        }
        var e, n, r
      }
      function D (t, e, n, r, s = new A(t, n, r)) {
        if (!s.closed) return e instanceof w ? e.subscribe(s) : N(e)(s)
      }
      class V extends f {
        notifyNext (t, e, n, r, s) {
          this.destination.next(e)
        }
        notifyError (t, e) {
          this.destination.error(t)
        }
        notifyComplete (t) {
          this.destination.complete()
        }
      }
      function j (t, e) {
        return function (n) {
          if ('function' != typeof t)
            throw new TypeError(
              'argument is not a function. Are you looking for `mapTo()`?'
            )
          return n.lift(new F(t, e))
        }
      }
      class F {
        constructor (t, e) {
          ;(this.project = t), (this.thisArg = e)
        }
        call (t, e) {
          return e.subscribe(new U(t, this.project, this.thisArg))
        }
      }
      class U extends f {
        constructor (t, e, n) {
          super(t),
            (this.project = e),
            (this.count = 0),
            (this.thisArg = n || this)
        }
        _next (t) {
          let e
          try {
            e = this.project.call(this.thisArg, t, this.count++)
          } catch (n) {
            return void this.destination.error(n)
          }
          this.destination.next(e)
        }
      }
      function L (t, e) {
        return new w(n => {
          const r = new h()
          let s = 0
          return (
            r.add(
              e.schedule(function () {
                s !== t.length
                  ? (n.next(t[s++]), n.closed || r.add(this.schedule()))
                  : n.complete()
              })
            ),
            r
          )
        })
      }
      function $ (t, e) {
        return e
          ? (function (t, e) {
              if (null != t) {
                if (
                  (function (t) {
                    return t && 'function' == typeof t[m]
                  })(t)
                )
                  return (function (t, e) {
                    return new w(n => {
                      const r = new h()
                      return (
                        r.add(
                          e.schedule(() => {
                            const s = t[m]()
                            r.add(
                              s.subscribe({
                                next (t) {
                                  r.add(e.schedule(() => n.next(t)))
                                },
                                error (t) {
                                  r.add(e.schedule(() => n.error(t)))
                                },
                                complete () {
                                  r.add(e.schedule(() => n.complete()))
                                }
                              })
                            )
                          })
                        ),
                        r
                      )
                    })
                  })(t, e)
                if (R(t))
                  return (function (t, e) {
                    return new w(n => {
                      const r = new h()
                      return (
                        r.add(
                          e.schedule(() =>
                            t.then(
                              t => {
                                r.add(
                                  e.schedule(() => {
                                    n.next(t),
                                      r.add(e.schedule(() => n.complete()))
                                  })
                                )
                              },
                              t => {
                                r.add(e.schedule(() => n.error(t)))
                              }
                            )
                          )
                        ),
                        r
                      )
                    })
                  })(t, e)
                if (P(t)) return L(t, e)
                if (
                  (function (t) {
                    return t && 'function' == typeof t[M]
                  })(t) ||
                  'string' == typeof t
                )
                  return (function (t, e) {
                    if (!t) throw new Error('Iterable cannot be null')
                    return new w(n => {
                      const r = new h()
                      let s
                      return (
                        r.add(() => {
                          s && 'function' == typeof s.return && s.return()
                        }),
                        r.add(
                          e.schedule(() => {
                            ;(s = t[M]()),
                              r.add(
                                e.schedule(function () {
                                  if (n.closed) return
                                  let t, e
                                  try {
                                    const n = s.next()
                                    ;(t = n.value), (e = n.done)
                                  } catch (r) {
                                    return void n.error(r)
                                  }
                                  e
                                    ? n.complete()
                                    : (n.next(t), this.schedule())
                                })
                              )
                          })
                        ),
                        r
                      )
                    })
                  })(t, e)
              }
              throw new TypeError(
                ((null !== t && typeof t) || t) + ' is not observable'
              )
            })(t, e)
          : t instanceof w
          ? t
          : new w(N(t))
      }
      function H (t, e, n = Number.POSITIVE_INFINITY) {
        return 'function' == typeof e
          ? r =>
              r.pipe(
                H((n, r) => $(t(n, r)).pipe(j((t, s) => e(n, t, r, s))), n)
              )
          : ('number' == typeof e && (n = e), e => e.lift(new G(t, n)))
      }
      class G {
        constructor (t, e = Number.POSITIVE_INFINITY) {
          ;(this.project = t), (this.concurrent = e)
        }
        call (t, e) {
          return e.subscribe(new z(t, this.project, this.concurrent))
        }
      }
      class z extends V {
        constructor (t, e, n = Number.POSITIVE_INFINITY) {
          super(t),
            (this.project = e),
            (this.concurrent = n),
            (this.hasCompleted = !1),
            (this.buffer = []),
            (this.active = 0),
            (this.index = 0)
        }
        _next (t) {
          this.active < this.concurrent ? this._tryNext(t) : this.buffer.push(t)
        }
        _tryNext (t) {
          let e
          const n = this.index++
          try {
            e = this.project(t, n)
          } catch (r) {
            return void this.destination.error(r)
          }
          this.active++, this._innerSub(e, t, n)
        }
        _innerSub (t, e, n) {
          const r = new A(this, e, n),
            s = this.destination
          s.add(r)
          const i = D(this, t, void 0, void 0, r)
          i !== r && s.add(i)
        }
        _complete () {
          ;(this.hasCompleted = !0),
            0 === this.active &&
              0 === this.buffer.length &&
              this.destination.complete(),
            this.unsubscribe()
        }
        notifyNext (t, e, n, r, s) {
          this.destination.next(e)
        }
        notifyComplete (t) {
          const e = this.buffer
          this.remove(t),
            this.active--,
            e.length > 0
              ? this._next(e.shift())
              : 0 === this.active &&
                this.hasCompleted &&
                this.destination.complete()
        }
      }
      function q (t = Number.POSITIVE_INFINITY) {
        return H(y, t)
      }
      function B (t, e) {
        return e ? L(t, e) : new w(O(t))
      }
      function W () {
        return function (t) {
          return t.lift(new Z(t))
        }
      }
      class Z {
        constructor (t) {
          this.connectable = t
        }
        call (t, e) {
          const { connectable: n } = this
          n._refCount++
          const r = new Q(t, n),
            s = e.subscribe(r)
          return r.closed || (r.connection = n.connect()), s
        }
      }
      class Q extends f {
        constructor (t, e) {
          super(t), (this.connectable = e)
        }
        _unsubscribe () {
          const { connectable: t } = this
          if (!t) return void (this.connection = null)
          this.connectable = null
          const e = t._refCount
          if (e <= 0) return void (this.connection = null)
          if (((t._refCount = e - 1), e > 1))
            return void (this.connection = null)
          const { connection: n } = this,
            r = t._connection
          ;(this.connection = null), !r || (n && r !== n) || r.unsubscribe()
        }
      }
      class J extends w {
        constructor (t, e) {
          super(),
            (this.source = t),
            (this.subjectFactory = e),
            (this._refCount = 0),
            (this._isComplete = !1)
        }
        _subscribe (t) {
          return this.getSubject().subscribe(t)
        }
        getSubject () {
          const t = this._subject
          return (
            (t && !t.isStopped) || (this._subject = this.subjectFactory()),
            this._subject
          )
        }
        connect () {
          let t = this._connection
          return (
            t ||
              ((this._isComplete = !1),
              (t = this._connection = new h()),
              t.add(this.source.subscribe(new Y(this.getSubject(), this))),
              t.closed && ((this._connection = null), (t = h.EMPTY))),
            t
          )
        }
        refCount () {
          return W()(this)
        }
      }
      const K = (() => {
        const t = J.prototype
        return {
          operator: { value: null },
          _refCount: { value: 0, writable: !0 },
          _subject: { value: null, writable: !0 },
          _connection: { value: null, writable: !0 },
          _subscribe: { value: t._subscribe },
          _isComplete: { value: t._isComplete, writable: !0 },
          getSubject: { value: t.getSubject },
          connect: { value: t.connect },
          refCount: { value: t.refCount }
        }
      })()
      class Y extends x {
        constructor (t, e) {
          super(t), (this.connectable = e)
        }
        _error (t) {
          this._unsubscribe(), super._error(t)
        }
        _complete () {
          ;(this.connectable._isComplete = !0),
            this._unsubscribe(),
            super._complete()
        }
        _unsubscribe () {
          const t = this.connectable
          if (t) {
            this.connectable = null
            const e = t._connection
            ;(t._refCount = 0),
              (t._subject = null),
              (t._connection = null),
              e && e.unsubscribe()
          }
        }
      }
      function X () {
        return new E()
      }
      function tt (t) {
        return { toString: t }.toString()
      }
      function et (t, e, n) {
        return tt(() => {
          const r = (function (t) {
            return function (...e) {
              if (t) {
                const n = t(...e)
                for (const t in n) this[t] = n[t]
              }
            }
          })(e)
          function s (...t) {
            if (this instanceof s) return r.apply(this, t), this
            const e = new s(...t)
            return (n.annotation = e), n
            function n (t, n, r) {
              const s = t.hasOwnProperty('__parameters__')
                ? t.__parameters__
                : Object.defineProperty(t, '__parameters__', { value: [] })
                    .__parameters__
              for (; s.length <= r; ) s.push(null)
              return (s[r] = s[r] || []).push(e), t
            }
          }
          return (
            n && (s.prototype = Object.create(n.prototype)),
            (s.prototype.ngMetadataName = t),
            (s.annotationCls = s),
            s
          )
        })
      }
      const nt = et('Inject', t => ({ token: t })),
        rt = et('Optional'),
        st = et('Self'),
        it = et('SkipSelf')
      var ot = (function (t) {
        return (
          (t[(t.Default = 0)] = 'Default'),
          (t[(t.Host = 1)] = 'Host'),
          (t[(t.Self = 2)] = 'Self'),
          (t[(t.SkipSelf = 4)] = 'SkipSelf'),
          (t[(t.Optional = 8)] = 'Optional'),
          t
        )
      })({})
      function at (t) {
        for (let e in t) if (t[e] === at) return e
        throw Error('Could not find renamed property on target object.')
      }
      function lt (t, e) {
        for (const n in e)
          e.hasOwnProperty(n) && !t.hasOwnProperty(n) && (t[n] = e[n])
      }
      function ut (t) {
        return {
          token: t.token,
          providedIn: t.providedIn || null,
          factory: t.factory,
          value: void 0
        }
      }
      function ct (t) {
        return {
          factory: t.factory,
          providers: t.providers || [],
          imports: t.imports || []
        }
      }
      function ht (t) {
        return dt(t, t[ft]) || dt(t, t[yt])
      }
      function dt (t, e) {
        return e && e.token === t ? e : null
      }
      function pt (t) {
        return t && (t.hasOwnProperty(gt) || t.hasOwnProperty(vt))
          ? t[gt]
          : null
      }
      const ft = at({ '\u0275prov': at }),
        gt = at({ '\u0275inj': at }),
        mt = at({ '\u0275provFallback': at }),
        yt = at({ ngInjectableDef: at }),
        vt = at({ ngInjectorDef: at })
      function _t (t) {
        if ('string' == typeof t) return t
        if (Array.isArray(t)) return '[' + t.map(_t).join(', ') + ']'
        if (null == t) return '' + t
        if (t.overriddenName) return `${t.overriddenName}`
        if (t.name) return `${t.name}`
        const e = t.toString()
        if (null == e) return '' + e
        const n = e.indexOf('\n')
        return -1 === n ? e : e.substring(0, n)
      }
      function wt (t, e) {
        return null == t || '' === t
          ? null === e
            ? ''
            : e
          : null == e || '' === e
          ? t
          : t + ' ' + e
      }
      const bt = at({ __forward_ref__: at })
      function Ct (t) {
        return (
          (t.__forward_ref__ = Ct),
          (t.toString = function () {
            return _t(this())
          }),
          t
        )
      }
      function St (t) {
        return xt(t) ? t() : t
      }
      function xt (t) {
        return (
          'function' == typeof t &&
          t.hasOwnProperty(bt) &&
          t.__forward_ref__ === Ct
        )
      }
      const Et = 'undefined' != typeof globalThis && globalThis,
        Tt = 'undefined' != typeof window && window,
        kt =
          'undefined' != typeof self &&
          'undefined' != typeof WorkerGlobalScope &&
          self instanceof WorkerGlobalScope &&
          self,
        At = 'undefined' != typeof global && global,
        Ot = Et || At || Tt || kt,
        It = at({ '\u0275cmp': at }),
        Mt = at({ '\u0275dir': at }),
        Pt = at({ '\u0275pipe': at }),
        Rt = at({ '\u0275mod': at }),
        Nt = at({ '\u0275loc': at }),
        Dt = at({ '\u0275fac': at }),
        Vt = at({ __NG_ELEMENT_ID__: at })
      class jt {
        constructor (t, e) {
          ;(this._desc = t),
            (this.ngMetadataName = 'InjectionToken'),
            (this.ɵprov = void 0),
            'number' == typeof e
              ? (this.__NG_ELEMENT_ID__ = e)
              : void 0 !== e &&
                (this.ɵprov = ut({
                  token: this,
                  providedIn: e.providedIn || 'root',
                  factory: e.factory
                }))
        }
        toString () {
          return `InjectionToken ${this._desc}`
        }
      }
      const Ft = new jt('INJECTOR', -1),
        Ut = {},
        Lt = /\n/gm,
        $t = at({ provide: String, useValue: at })
      let Ht,
        Gt = void 0
      function zt (t) {
        const e = Gt
        return (Gt = t), e
      }
      function qt (t) {
        const e = Ht
        return (Ht = t), e
      }
      function Bt (t, e = ot.Default) {
        if (void 0 === Gt)
          throw new Error('inject() must be called from an injection context')
        return null === Gt
          ? Zt(t, void 0, e)
          : Gt.get(t, e & ot.Optional ? null : void 0, e)
      }
      function Wt (t, e = ot.Default) {
        return (Ht || Bt)(St(t), e)
      }
      function Zt (t, e, n) {
        const r = ht(t)
        if (r && 'root' == r.providedIn)
          return void 0 === r.value ? (r.value = r.factory()) : r.value
        if (n & ot.Optional) return null
        if (void 0 !== e) return e
        throw new Error(`Injector: NOT_FOUND [${_t(t)}]`)
      }
      function Qt (t) {
        const e = []
        for (let n = 0; n < t.length; n++) {
          const r = St(t[n])
          if (Array.isArray(r)) {
            if (0 === r.length)
              throw new Error('Arguments array must have arguments.')
            let t = void 0,
              n = ot.Default
            for (let e = 0; e < r.length; e++) {
              const s = r[e]
              s instanceof rt || 'Optional' === s.ngMetadataName || s === rt
                ? (n |= ot.Optional)
                : s instanceof it || 'SkipSelf' === s.ngMetadataName || s === it
                ? (n |= ot.SkipSelf)
                : s instanceof st || 'Self' === s.ngMetadataName || s === st
                ? (n |= ot.Self)
                : (t = s instanceof nt || s === nt ? s.token : s)
            }
            e.push(Wt(t, n))
          } else e.push(Wt(r))
        }
        return e
      }
      class Jt {
        get (t, e = Ut) {
          if (e === Ut) {
            const e = new Error(`NullInjectorError: No provider for ${_t(t)}!`)
            throw ((e.name = 'NullInjectorError'), e)
          }
          return e
        }
      }
      class Kt {}
      class Yt {}
      function Xt (t, e) {
        t.forEach(t => (Array.isArray(t) ? Xt(t, e) : e(t)))
      }
      function te (t, e, n) {
        e >= t.length ? t.push(n) : t.splice(e, 0, n)
      }
      function ee (t, e) {
        return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0]
      }
      function ne (t, e, n) {
        let r = se(t, e)
        return (
          r >= 0
            ? (t[1 | r] = n)
            : ((r = ~r),
              (function (t, e, n, r) {
                let s = t.length
                if (s == e) t.push(n, r)
                else if (1 === s) t.push(r, t[0]), (t[0] = n)
                else {
                  for (s--, t.push(t[s - 1], t[s]); s > e; )
                    (t[s] = t[s - 2]), s--
                  ;(t[e] = n), (t[e + 1] = r)
                }
              })(t, r, e, n)),
          r
        )
      }
      function re (t, e) {
        const n = se(t, e)
        if (n >= 0) return t[1 | n]
      }
      function se (t, e) {
        return (function (t, e, n) {
          let r = 0,
            s = t.length >> 1
          for (; s !== r; ) {
            const n = r + ((s - r) >> 1),
              i = t[n << 1]
            if (e === i) return n << 1
            i > e ? (s = n) : (r = n + 1)
          }
          return ~(s << 1)
        })(t, e)
      }
      const ie = (function () {
          var t = { OnPush: 0, Default: 1 }
          return (t[t.OnPush] = 'OnPush'), (t[t.Default] = 'Default'), t
        })(),
        oe = (function () {
          var t = { Emulated: 0, Native: 1, None: 2, ShadowDom: 3 }
          return (
            (t[t.Emulated] = 'Emulated'),
            (t[t.Native] = 'Native'),
            (t[t.None] = 'None'),
            (t[t.ShadowDom] = 'ShadowDom'),
            t
          )
        })(),
        ae = {},
        le = []
      let ue = 0
      function ce (t) {
        return tt(() => {
          const e = t.type,
            n = e.prototype,
            r = {},
            s = {
              type: e,
              providersResolver: null,
              decls: t.decls,
              vars: t.vars,
              factory: null,
              template: t.template || null,
              consts: t.consts || null,
              ngContentSelectors: t.ngContentSelectors,
              hostBindings: t.hostBindings || null,
              hostVars: t.hostVars || 0,
              hostAttrs: t.hostAttrs || null,
              contentQueries: t.contentQueries || null,
              declaredInputs: r,
              inputs: null,
              outputs: null,
              exportAs: t.exportAs || null,
              onChanges: null,
              onInit: n.ngOnInit || null,
              doCheck: n.ngDoCheck || null,
              afterContentInit: n.ngAfterContentInit || null,
              afterContentChecked: n.ngAfterContentChecked || null,
              afterViewInit: n.ngAfterViewInit || null,
              afterViewChecked: n.ngAfterViewChecked || null,
              onDestroy: n.ngOnDestroy || null,
              onPush: t.changeDetection === ie.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              selectors: t.selectors || le,
              viewQuery: t.viewQuery || null,
              features: t.features || null,
              data: t.data || {},
              encapsulation: t.encapsulation || oe.Emulated,
              id: 'c',
              styles: t.styles || le,
              _: null,
              setInput: null,
              schemas: t.schemas || null,
              tView: null
            },
            i = t.directives,
            o = t.features,
            a = t.pipes
          return (
            (s.id += ue++),
            (s.inputs = ge(t.inputs, r)),
            (s.outputs = ge(t.outputs)),
            o && o.forEach(t => t(s)),
            (s.directiveDefs = i
              ? () => ('function' == typeof i ? i() : i).map(he)
              : null),
            (s.pipeDefs = a
              ? () => ('function' == typeof a ? a() : a).map(de)
              : null),
            s
          )
        })
      }
      function he (t) {
        return (
          ve(t) ||
          (function (t) {
            return t[Mt] || null
          })(t)
        )
      }
      function de (t) {
        return (function (t) {
          return t[Pt] || null
        })(t)
      }
      const pe = {}
      function fe (t) {
        const e = {
          type: t.type,
          bootstrap: t.bootstrap || le,
          declarations: t.declarations || le,
          imports: t.imports || le,
          exports: t.exports || le,
          transitiveCompileScopes: null,
          schemas: t.schemas || null,
          id: t.id || null
        }
        return (
          null != t.id &&
            tt(() => {
              pe[t.id] = t.type
            }),
          e
        )
      }
      function ge (t, e) {
        if (null == t) return ae
        const n = {}
        for (const r in t)
          if (t.hasOwnProperty(r)) {
            let s = t[r],
              i = s
            Array.isArray(s) && ((i = s[1]), (s = s[0])),
              (n[s] = r),
              e && (e[s] = i)
          }
        return n
      }
      const me = ce
      function ye (t) {
        return {
          type: t.type,
          name: t.name,
          factory: null,
          pure: !1 !== t.pure,
          onDestroy: t.type.prototype.ngOnDestroy || null
        }
      }
      function ve (t) {
        return t[It] || null
      }
      function _e (t, e) {
        return t.hasOwnProperty(Dt) ? t[Dt] : null
      }
      function we (t, e) {
        const n = t[Rt] || null
        if (!n && !0 === e)
          throw new Error(`Type ${_t(t)} does not have '\u0275mod' property.`)
        return n
      }
      function be (t) {
        return Array.isArray(t) && 'object' == typeof t[1]
      }
      function Ce (t) {
        return Array.isArray(t) && !0 === t[1]
      }
      function Se (t) {
        return 0 != (8 & t.flags)
      }
      function xe (t) {
        return 2 == (2 & t.flags)
      }
      function Ee (t) {
        return 1 == (1 & t.flags)
      }
      function Te (t) {
        return null !== t.template
      }
      function ke (t) {
        return 0 != (512 & t[2])
      }
      let Ae = void 0
      function Oe (t) {
        return !!t.listen
      }
      const Ie = {
        createRenderer: (t, e) =>
          void 0 !== Ae
            ? Ae
            : 'undefined' != typeof document
            ? document
            : void 0
      }
      function Me (t) {
        for (; Array.isArray(t); ) t = t[0]
        return t
      }
      function Pe (t, e) {
        return Me(e[t + 19])
      }
      function Re (t, e) {
        return Me(e[t.index])
      }
      function Ne (t, e) {
        return t.data[e + 19]
      }
      function De (t, e) {
        return t[e + 19]
      }
      function Ve (t, e) {
        const n = e[t]
        return be(n) ? n : n[0]
      }
      function je (t) {
        const e = (function (t) {
          return t.__ngContext__ || null
        })(t)
        return e ? (Array.isArray(e) ? e : e.lView) : null
      }
      function Fe (t) {
        return 4 == (4 & t[2])
      }
      function Ue (t) {
        return 128 == (128 & t[2])
      }
      function Le (t, e) {
        return null === t || null == e ? null : t[e]
      }
      function $e (t) {
        t[18] = 0
      }
      const He = {
        lFrame: un(null),
        bindingsEnabled: !0,
        checkNoChangesMode: !1
      }
      function Ge () {
        return He.bindingsEnabled
      }
      function ze () {
        return He.lFrame.lView
      }
      function qe () {
        return He.lFrame.tView
      }
      function Be (t) {
        He.lFrame.contextLView = t
      }
      function We () {
        return He.lFrame.previousOrParentTNode
      }
      function Ze (t, e) {
        ;(He.lFrame.previousOrParentTNode = t), (He.lFrame.isParent = e)
      }
      function Qe () {
        return He.lFrame.isParent
      }
      function Je () {
        return He.checkNoChangesMode
      }
      function Ke (t) {
        He.checkNoChangesMode = t
      }
      function Ye () {
        const t = He.lFrame
        let e = t.bindingRootIndex
        return (
          -1 === e && (e = t.bindingRootIndex = t.tView.bindingStartIndex), e
        )
      }
      function Xe () {
        return He.lFrame.bindingIndex
      }
      function tn () {
        return He.lFrame.bindingIndex++
      }
      function en (t) {
        const e = He.lFrame,
          n = e.bindingIndex
        return (e.bindingIndex = e.bindingIndex + t), n
      }
      function nn (t, e) {
        const n = He.lFrame
        ;(n.bindingIndex = n.bindingRootIndex = t),
          (n.currentDirectiveIndex = e)
      }
      function rn () {
        return He.lFrame.currentQueryIndex
      }
      function sn (t) {
        He.lFrame.currentQueryIndex = t
      }
      function on (t, e) {
        const n = ln()
        ;(He.lFrame = n), (n.previousOrParentTNode = e), (n.lView = t)
      }
      function an (t, e) {
        const n = ln(),
          r = t[1]
        ;(He.lFrame = n),
          (n.previousOrParentTNode = e),
          (n.lView = t),
          (n.tView = r),
          (n.contextLView = t),
          (n.bindingIndex = r.bindingStartIndex)
      }
      function ln () {
        const t = He.lFrame,
          e = null === t ? null : t.child
        return null === e ? un(t) : e
      }
      function un (t) {
        const e = {
          previousOrParentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: 0,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentSanitizer: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: t,
          child: null
        }
        return null !== t && (t.child = e), e
      }
      function cn () {
        const t = He.lFrame
        return (
          (He.lFrame = t.parent),
          (t.previousOrParentTNode = null),
          (t.lView = null),
          t
        )
      }
      const hn = cn
      function dn () {
        const t = cn()
        ;(t.isParent = !0),
          (t.tView = null),
          (t.selectedIndex = 0),
          (t.contextLView = null),
          (t.elementDepthCount = 0),
          (t.currentDirectiveIndex = -1),
          (t.currentNamespace = null),
          (t.currentSanitizer = null),
          (t.bindingRootIndex = -1),
          (t.bindingIndex = -1),
          (t.currentQueryIndex = 0)
      }
      function pn () {
        return He.lFrame.selectedIndex
      }
      function fn (t) {
        He.lFrame.selectedIndex = t
      }
      function gn () {
        const t = He.lFrame
        return Ne(t.tView, t.selectedIndex)
      }
      function mn (t, e) {
        for (let n = e.directiveStart, r = e.directiveEnd; n < r; n++) {
          const e = t.data[n]
          e.afterContentInit &&
            (t.contentHooks || (t.contentHooks = [])).push(
              -n,
              e.afterContentInit
            ),
            e.afterContentChecked &&
              ((t.contentHooks || (t.contentHooks = [])).push(
                n,
                e.afterContentChecked
              ),
              (t.contentCheckHooks || (t.contentCheckHooks = [])).push(
                n,
                e.afterContentChecked
              )),
            e.afterViewInit &&
              (t.viewHooks || (t.viewHooks = [])).push(-n, e.afterViewInit),
            e.afterViewChecked &&
              ((t.viewHooks || (t.viewHooks = [])).push(n, e.afterViewChecked),
              (t.viewCheckHooks || (t.viewCheckHooks = [])).push(
                n,
                e.afterViewChecked
              )),
            null != e.onDestroy &&
              (t.destroyHooks || (t.destroyHooks = [])).push(n, e.onDestroy)
        }
      }
      function yn (t, e, n) {
        wn(t, e, 3, n)
      }
      function vn (t, e, n, r) {
        ;(3 & t[2]) === n && wn(t, e, n, r)
      }
      function _n (t, e) {
        let n = t[2]
        ;(3 & n) === e && ((n &= 1023), (n += 1), (t[2] = n))
      }
      function wn (t, e, n, r) {
        const s = null != r ? r : -1
        let i = 0
        for (let o = void 0 !== r ? 65535 & t[18] : 0; o < e.length; o++)
          if ('number' == typeof e[o + 1]) {
            if (((i = e[o]), null != r && i >= r)) break
          } else
            e[o] < 0 && (t[18] += 65536),
              (i < s || -1 == s) &&
                (bn(t, n, e, o), (t[18] = (4294901760 & t[18]) + o + 2)),
              o++
      }
      function bn (t, e, n, r) {
        const s = n[r] < 0,
          i = n[r + 1],
          o = t[s ? -n[r] : n[r]]
        s
          ? t[2] >> 10 < t[18] >> 16 &&
            (3 & t[2]) === e &&
            ((t[2] += 1024), i.call(o))
          : i.call(o)
      }
      class Cn {
        constructor (t, e, n) {
          ;(this.factory = t),
            (this.resolving = !1),
            (this.canSeeViewProviders = e),
            (this.injectImpl = n)
        }
      }
      function Sn (t, e, n) {
        const r = Oe(t)
        let s = 0
        for (; s < n.length; ) {
          const i = n[s]
          if ('number' == typeof i) {
            if (0 !== i) break
            s++
            const o = n[s++],
              a = n[s++],
              l = n[s++]
            r ? t.setAttribute(e, a, l, o) : e.setAttributeNS(o, a, l)
          } else {
            const o = i,
              a = n[++s]
            En(o)
              ? r && t.setProperty(e, o, a)
              : r
              ? t.setAttribute(e, o, a)
              : e.setAttribute(o, a),
              s++
          }
        }
        return s
      }
      function xn (t) {
        return 3 === t || 4 === t || 6 === t
      }
      function En (t) {
        return 64 === t.charCodeAt(0)
      }
      function Tn (t, e) {
        if (null === e || 0 === e.length);
        else if (null === t || 0 === t.length) t = e.slice()
        else {
          let n = -1
          for (let r = 0; r < e.length; r++) {
            const s = e[r]
            'number' == typeof s
              ? (n = s)
              : 0 === n ||
                kn(t, n, s, null, -1 === n || 2 === n ? e[++r] : null)
          }
        }
        return t
      }
      function kn (t, e, n, r, s) {
        let i = 0,
          o = t.length
        if (-1 === e) o = -1
        else
          for (; i < t.length; ) {
            const n = t[i++]
            if ('number' == typeof n) {
              if (n === e) {
                o = -1
                break
              }
              if (n > e) {
                o = i - 1
                break
              }
            }
          }
        for (; i < t.length; ) {
          const e = t[i]
          if ('number' == typeof e) break
          if (e === n) {
            if (null === r) return void (null !== s && (t[i + 1] = s))
            if (r === t[i + 1]) return void (t[i + 2] = s)
          }
          i++, null !== r && i++, null !== s && i++
        }
        ;-1 !== o && (t.splice(o, 0, e), (i = o + 1)),
          t.splice(i++, 0, n),
          null !== r && t.splice(i++, 0, r),
          null !== s && t.splice(i++, 0, s)
      }
      function An (t) {
        return -1 !== t
      }
      function On (t) {
        return 32767 & t
      }
      function In (t) {
        return t >> 16
      }
      function Mn (t, e) {
        let n = In(t),
          r = e
        for (; n > 0; ) (r = r[15]), n--
        return r
      }
      function Pn (t) {
        return 'string' == typeof t ? t : null == t ? '' : '' + t
      }
      function Rn (t) {
        return 'function' == typeof t
          ? t.name || t.toString()
          : 'object' == typeof t && null != t && 'function' == typeof t.type
          ? t.type.name || t.type.toString()
          : Pn(t)
      }
      const Nn = (() =>
        (
          ('undefined' != typeof requestAnimationFrame &&
            requestAnimationFrame) ||
          setTimeout
        ).bind(Ot))()
      function Dn (t) {
        return t instanceof Function ? t() : t
      }
      let Vn = !0
      function jn (t) {
        const e = Vn
        return (Vn = t), e
      }
      let Fn = 0
      function Un (t, e) {
        const n = $n(t, e)
        if (-1 !== n) return n
        const r = e[1]
        r.firstCreatePass &&
          ((t.injectorIndex = e.length),
          Ln(r.data, t),
          Ln(e, null),
          Ln(r.blueprint, null))
        const s = Hn(t, e),
          i = t.injectorIndex
        if (An(s)) {
          const t = On(s),
            n = Mn(s, e),
            r = n[1].data
          for (let s = 0; s < 8; s++) e[i + s] = n[t + s] | r[t + s]
        }
        return (e[i + 8] = s), i
      }
      function Ln (t, e) {
        t.push(0, 0, 0, 0, 0, 0, 0, 0, e)
      }
      function $n (t, e) {
        return -1 === t.injectorIndex ||
          (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
          null == e[t.injectorIndex + 8]
          ? -1
          : t.injectorIndex
      }
      function Hn (t, e) {
        if (t.parent && -1 !== t.parent.injectorIndex)
          return t.parent.injectorIndex
        let n = e[6],
          r = 1
        for (; n && -1 === n.injectorIndex; )
          (n = (e = e[15]) ? e[6] : null), r++
        return n ? n.injectorIndex | (r << 16) : -1
      }
      function Gn (t, e, n) {
        !(function (t, e, n) {
          let r = 'string' != typeof n ? n[Vt] : n.charCodeAt(0) || 0
          null == r && (r = n[Vt] = Fn++)
          const s = 255 & r,
            i = 1 << s,
            o = 64 & s,
            a = 32 & s,
            l = e.data
          128 & s
            ? o
              ? a
                ? (l[t + 7] |= i)
                : (l[t + 6] |= i)
              : a
              ? (l[t + 5] |= i)
              : (l[t + 4] |= i)
            : o
            ? a
              ? (l[t + 3] |= i)
              : (l[t + 2] |= i)
            : a
            ? (l[t + 1] |= i)
            : (l[t] |= i)
        })(t, e, n)
      }
      function zn (t, e, n, r = ot.Default, s) {
        if (null !== t) {
          const s = (function (t) {
            if ('string' == typeof t) return t.charCodeAt(0) || 0
            const e = t[Vt]
            return 'number' == typeof e && e > 0 ? 255 & e : e
          })(n)
          if ('function' == typeof s) {
            on(e, t)
            try {
              const t = s()
              if (null != t || r & ot.Optional) return t
              throw new Error(`No provider for ${Rn(n)}!`)
            } finally {
              hn()
            }
          } else if ('number' == typeof s) {
            if (-1 === s) return new Kn(t, e)
            let i = null,
              o = $n(t, e),
              a = -1,
              l = r & ot.Host ? e[16][6] : null
            for (
              (-1 === o || r & ot.SkipSelf) &&
              ((a = -1 === o ? Hn(t, e) : e[o + 8]),
              Jn(r, !1) ? ((i = e[1]), (o = On(a)), (e = Mn(a, e))) : (o = -1));
              -1 !== o;

            ) {
              a = e[o + 8]
              const t = e[1]
              if (Qn(s, o, t.data)) {
                const t = Bn(o, e, n, i, r, l)
                if (t !== qn) return t
              }
              Jn(r, e[1].data[o + 8] === l) && Qn(s, o, e)
                ? ((i = t), (o = On(a)), (e = Mn(a, e)))
                : (o = -1)
            }
          }
        }
        if (
          (r & ot.Optional && void 0 === s && (s = null),
          0 == (r & (ot.Self | ot.Host)))
        ) {
          const t = e[9],
            i = qt(void 0)
          try {
            return t ? t.get(n, s, r & ot.Optional) : Zt(n, s, r & ot.Optional)
          } finally {
            qt(i)
          }
        }
        if (r & ot.Optional) return s
        throw new Error(`NodeInjector: NOT_FOUND [${Rn(n)}]`)
      }
      const qn = {}
      function Bn (t, e, n, r, s, i) {
        const o = e[1],
          a = o.data[t + 8],
          l = Wn(
            a,
            o,
            n,
            null == r ? xe(a) && Vn : r != o && 3 === a.type,
            s & ot.Host && i === a
          )
        return null !== l ? Zn(e, o, l, a) : qn
      }
      function Wn (t, e, n, r, s) {
        const i = t.providerIndexes,
          o = e.data,
          a = 65535 & i,
          l = t.directiveStart,
          u = i >> 16,
          c = s ? a + u : t.directiveEnd
        for (let h = r ? a : a + u; h < c; h++) {
          const t = o[h]
          if ((h < l && n === t) || (h >= l && t.type === n)) return h
        }
        if (s) {
          const t = o[l]
          if (t && Te(t) && t.type === n) return l
        }
        return null
      }
      function Zn (t, e, n, r) {
        let s = t[n]
        const i = e.data
        if (s instanceof Cn) {
          const o = s
          if (o.resolving) throw new Error(`Circular dep for ${Rn(i[n])}`)
          const a = jn(o.canSeeViewProviders)
          let l
          ;(o.resolving = !0), o.injectImpl && (l = qt(o.injectImpl)), on(t, r)
          try {
            ;(s = t[n] = o.factory(void 0, i, t, r)),
              e.firstCreatePass &&
                n >= r.directiveStart &&
                (function (t, e, n) {
                  const { onChanges: r, onInit: s, doCheck: i } = e
                  r &&
                    ((n.preOrderHooks || (n.preOrderHooks = [])).push(t, r),
                    (n.preOrderCheckHooks || (n.preOrderCheckHooks = [])).push(
                      t,
                      r
                    )),
                    s &&
                      (n.preOrderHooks || (n.preOrderHooks = [])).push(-t, s),
                    i &&
                      ((n.preOrderHooks || (n.preOrderHooks = [])).push(t, i),
                      (
                        n.preOrderCheckHooks || (n.preOrderCheckHooks = [])
                      ).push(t, i))
                })(n, i[n], e)
          } finally {
            o.injectImpl && qt(l), jn(a), (o.resolving = !1), hn()
          }
        }
        return s
      }
      function Qn (t, e, n) {
        const r = 64 & t,
          s = 32 & t
        let i
        return (
          (i =
            128 & t
              ? r
                ? s
                  ? n[e + 7]
                  : n[e + 6]
                : s
                ? n[e + 5]
                : n[e + 4]
              : r
              ? s
                ? n[e + 3]
                : n[e + 2]
              : s
              ? n[e + 1]
              : n[e]),
          !!(i & (1 << t))
        )
      }
      function Jn (t, e) {
        return !(t & ot.Self || (t & ot.Host && e))
      }
      class Kn {
        constructor (t, e) {
          ;(this._tNode = t), (this._lView = e)
        }
        get (t, e) {
          return zn(this._tNode, this._lView, t, void 0, e)
        }
      }
      function Yn (t) {
        return tt(() => {
          const e = Object.getPrototypeOf(t.prototype).constructor,
            n =
              e[Dt] ||
              (function t (e) {
                const n = e
                if (xt(e))
                  return () => {
                    const e = t(St(n))
                    return e ? e() : null
                  }
                let r = _e(n)
                if (null === r) {
                  const t = pt(n)
                  r = t && t.factory
                }
                return r || null
              })(e)
          return null !== n ? n : t => new t()
        })
      }
      function Xn (t) {
        return t.ngDebugContext
      }
      function tr (t) {
        return t.ngOriginalError
      }
      function er (t, ...e) {
        t.error(...e)
      }
      class nr {
        constructor () {
          this._console = console
        }
        handleError (t) {
          const e = this._findOriginalError(t),
            n = this._findContext(t),
            r = (function (t) {
              return t.ngErrorLogger || er
            })(t)
          r(this._console, 'ERROR', t),
            e && r(this._console, 'ORIGINAL ERROR', e),
            n && r(this._console, 'ERROR CONTEXT', n)
        }
        _findContext (t) {
          return t ? (Xn(t) ? Xn(t) : this._findContext(tr(t))) : null
        }
        _findOriginalError (t) {
          let e = tr(t)
          for (; e && tr(e); ) e = tr(e)
          return e
        }
      }
      class rr {
        constructor (t) {
          this.changingThisBreaksApplicationSecurity = t
        }
        toString () {
          return (
            `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity}` +
            ' (see http://g.co/ng/security#xss)'
          )
        }
      }
      function sr (t) {
        return t instanceof rr ? t.changingThisBreaksApplicationSecurity : t
      }
      let ir = !0,
        or = !1
      function ar () {
        return (or = !0), ir
      }
      const lr = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi,
        ur =
          /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+\/]+=*$/i,
        cr = (function () {
          var t = {
            NONE: 0,
            HTML: 1,
            STYLE: 2,
            SCRIPT: 3,
            URL: 4,
            RESOURCE_URL: 5
          }
          return (
            (t[t.NONE] = 'NONE'),
            (t[t.HTML] = 'HTML'),
            (t[t.STYLE] = 'STYLE'),
            (t[t.SCRIPT] = 'SCRIPT'),
            (t[t.URL] = 'URL'),
            (t[t.RESOURCE_URL] = 'RESOURCE_URL'),
            t
          )
        })()
      function hr (t) {
        const e = (function () {
          const t = ze()
          return t && t[12]
        })()
        return e
          ? e.sanitize(cr.URL, t) || ''
          : (function (t, e) {
              const n = (function (t) {
                return (t instanceof rr && t.getTypeName()) || null
              })(t)
              if (null != n && n !== e) {
                if ('ResourceURL' === n && 'URL' === e) return !0
                throw new Error(
                  `Required a safe ${e}, got a ${n} (see http://g.co/ng/security#xss)`
                )
              }
              return n === e
            })(t, 'URL')
          ? sr(t)
          : ((n = Pn(t)),
            (n = String(n)).match(lr) || n.match(ur)
              ? n
              : (ar() &&
                  console.warn(
                    `WARNING: sanitizing unsafe URL value ${n} (see http://g.co/ng/security#xss)`
                  ),
                'unsafe:' + n))
        var n
      }
      function dr (t, e) {
        t.__ngContext__ = e
      }
      function pr (t) {
        throw new Error(
          `Multiple components match node with tagname ${t.tagName}`
        )
      }
      function fr () {
        throw new Error('Cannot mix multi providers and regular providers')
      }
      function gr (t, e, n) {
        let r = t.length
        for (;;) {
          const s = t.indexOf(e, n)
          if (-1 === s) return s
          if (0 === s || t.charCodeAt(s - 1) <= 32) {
            const n = e.length
            if (s + n === r || t.charCodeAt(s + n) <= 32) return s
          }
          n = s + 1
        }
      }
      function mr (t, e, n) {
        let r = 0
        for (; r < t.length; ) {
          let s = t[r++]
          if (n && 'class' === s) {
            if (((s = t[r]), -1 !== gr(s.toLowerCase(), e, 0))) return !0
          } else if (1 === s) {
            for (; r < t.length && 'string' == typeof (s = t[r++]); )
              if (s.toLowerCase() === e) return !0
            return !1
          }
        }
        return !1
      }
      function yr (t, e, n) {
        return e === (0 !== t.type || n ? t.tagName : 'ng-template')
      }
      function vr (t, e, n) {
        let r = 4
        const s = t.attrs || [],
          i = (function (t) {
            for (let e = 0; e < t.length; e++) if (xn(t[e])) return e
            return t.length
          })(s)
        let o = !1
        for (let a = 0; a < e.length; a++) {
          const l = e[a]
          if ('number' != typeof l) {
            if (!o)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ('' !== l && !yr(t, l, n)) || ('' === l && 1 === e.length))
                ) {
                  if (_r(r)) return !1
                  o = !0
                }
              } else {
                const u = 8 & r ? l : e[++a]
                if (8 & r && null !== t.attrs) {
                  if (!mr(t.attrs, u, n)) {
                    if (_r(r)) return !1
                    o = !0
                  }
                  continue
                }
                const c = wr(
                  8 & r ? 'class' : l,
                  s,
                  0 == t.type && 'ng-template' !== t.tagName,
                  n
                )
                if (-1 === c) {
                  if (_r(r)) return !1
                  o = !0
                  continue
                }
                if ('' !== u) {
                  let t
                  t = c > i ? '' : s[c + 1].toLowerCase()
                  const e = 8 & r ? t : null
                  if ((e && -1 !== gr(e, u, 0)) || (2 & r && u !== t)) {
                    if (_r(r)) return !1
                    o = !0
                  }
                }
              }
          } else {
            if (!o && !_r(r) && !_r(l)) return !1
            if (o && _r(l)) continue
            ;(o = !1), (r = l | (1 & r))
          }
        }
        return _r(r) || o
      }
      function _r (t) {
        return 0 == (1 & t)
      }
      function wr (t, e, n, r) {
        if (null === e) return -1
        let s = 0
        if (r || !n) {
          let n = !1
          for (; s < e.length; ) {
            const r = e[s]
            if (r === t) return s
            if (3 === r || 6 === r) n = !0
            else {
              if (1 === r || 2 === r) {
                let t = e[++s]
                for (; 'string' == typeof t; ) t = e[++s]
                continue
              }
              if (4 === r) break
              if (0 === r) {
                s += 4
                continue
              }
            }
            s += n ? 1 : 2
          }
          return -1
        }
        return (function (t, e) {
          let n = t.indexOf(4)
          if (n > -1)
            for (n++; n < t.length; ) {
              if (t[n] === e) return n
              n++
            }
          return -1
        })(e, t)
      }
      function br (t, e, n = !1) {
        for (let r = 0; r < e.length; r++) if (vr(t, e[r], n)) return !0
        return !1
      }
      function Cr (t, e) {
        return t ? ':not(' + e.trim() + ')' : e
      }
      function Sr (t) {
        let e = t[0],
          n = 1,
          r = 2,
          s = '',
          i = !1
        for (; n < t.length; ) {
          let o = t[n]
          if ('string' == typeof o)
            if (2 & r) {
              const e = t[++n]
              s += '[' + o + (e.length > 0 ? '="' + e + '"' : '') + ']'
            } else 8 & r ? (s += '.' + o) : 4 & r && (s += ' ' + o)
          else
            '' === s || _r(o) || ((e += Cr(i, s)), (s = '')),
              (r = o),
              (i = i || !_r(r))
          n++
        }
        return '' !== s && (e += Cr(i, s)), e
      }
      const xr = {}
      function Er (t) {
        const e = t[3]
        return Ce(e) ? e[3] : e
      }
      function Tr (t) {
        kr(qe(), ze(), pn() + t, Je())
      }
      function kr (t, e, n, r) {
        if (!r)
          if (3 == (3 & e[2])) {
            const r = t.preOrderCheckHooks
            null !== r && yn(e, r, n)
          } else {
            const r = t.preOrderHooks
            null !== r && vn(e, r, 0, n)
          }
        fn(n)
      }
      function Ar (t, e) {
        return (t << 17) | (e << 2)
      }
      function Or (t) {
        return (t >> 17) & 32767
      }
      function Ir (t) {
        return 2 | t
      }
      function Mr (t) {
        return (131068 & t) >> 2
      }
      function Pr (t, e) {
        return (-131069 & t) | (e << 2)
      }
      function Rr (t) {
        return 1 | t
      }
      function Nr (t, e) {
        const n = t.contentQueries
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) {
            const s = n[r],
              i = n[r + 1]
            if (-1 !== i) {
              const n = t.data[i]
              sn(s), n.contentQueries(2, e[i], i)
            }
          }
      }
      function Dr (t, e, n) {
        return Oe(e)
          ? e.createElement(t, n)
          : null === n
          ? e.createElement(t)
          : e.createElementNS(n, t)
      }
      function Vr (t, e, n, r, s, i, o, a, l, u) {
        const c = e.blueprint.slice()
        return (
          (c[0] = s),
          (c[2] = 140 | r),
          $e(c),
          (c[3] = c[15] = t),
          (c[8] = n),
          (c[10] = o || (t && t[10])),
          (c[11] = a || (t && t[11])),
          (c[12] = l || (t && t[12]) || null),
          (c[9] = u || (t && t[9]) || null),
          (c[6] = i),
          (c[16] = 2 == e.type ? t[16] : c),
          c
        )
      }
      function jr (t, e, n, r, s, i) {
        const o = n + 19,
          a =
            t.data[o] ||
            (function (t, e, n, r, s, i) {
              const o = We(),
                a = Qe(),
                l = a ? o : o && o.parent,
                u = (t.data[n] = Br(0, l && l !== e ? l : null, r, n, s, i))
              return (
                null === t.firstChild && (t.firstChild = u),
                o &&
                  (!a || null != o.child || (null === u.parent && 2 !== o.type)
                    ? a || (o.next = u)
                    : (o.child = u)),
                u
              )
            })(t, e, o, r, s, i)
        return Ze(a, !0), a
      }
      function Fr (t, e, n) {
        an(e, e[6])
        try {
          const r = t.viewQuery
          null !== r && gs(1, r, n)
          const s = t.template
          null !== s && $r(t, e, s, 1, n),
            t.firstCreatePass && (t.firstCreatePass = !1),
            t.staticContentQueries && Nr(t, e),
            t.staticViewQueries && gs(2, t.viewQuery, n)
          const i = t.components
          null !== i &&
            (function (t, e) {
              for (let n = 0; n < e.length; n++) cs(t, e[n])
            })(e, i)
        } finally {
          ;(e[2] &= -5), dn()
        }
      }
      function Ur (t, e, n, r) {
        const s = e[2]
        if (256 == (256 & s)) return
        an(e, e[6])
        const i = Je()
        try {
          $e(e),
            (He.lFrame.bindingIndex = t.bindingStartIndex),
            null !== n && $r(t, e, n, 2, r)
          const o = 3 == (3 & s)
          if (!i)
            if (o) {
              const n = t.preOrderCheckHooks
              null !== n && yn(e, n, null)
            } else {
              const n = t.preOrderHooks
              null !== n && vn(e, n, 0, null), _n(e, 0)
            }
          if (
            ((function (t) {
              let e = t[13]
              for (; null !== e; ) {
                let n
                if (Ce(e) && (n = e[2]) >> 1 == -1) {
                  for (let t = 9; t < e.length; t++) {
                    const n = e[t],
                      r = n[1]
                    Ue(n) && Ur(r, n, r.template, n[8])
                  }
                  0 != (1 & n) && ls(e, t[16])
                }
                e = e[4]
              }
            })(e),
            null !== t.contentQueries && Nr(t, e),
            !i)
          )
            if (o) {
              const n = t.contentCheckHooks
              null !== n && yn(e, n)
            } else {
              const n = t.contentHooks
              null !== n && vn(e, n, 1), _n(e, 1)
            }
          !(function (t, e) {
            try {
              const n = t.expandoInstructions
              if (null !== n) {
                let r = t.expandoStartIndex,
                  s = -1,
                  i = -1
                for (let t = 0; t < n.length; t++) {
                  const o = n[t]
                  'number' == typeof o
                    ? o <= 0
                      ? ((i = 0 - o), fn(i), (r += 9 + n[++t]), (s = r))
                      : (r += o)
                    : (null !== o && (nn(r, s), o(2, e[s])), s++)
                }
              }
            } finally {
              fn(-1)
            }
          })(t, e)
          const a = t.components
          null !== a &&
            (function (t, e) {
              for (let n = 0; n < e.length; n++) us(t, e[n])
            })(e, a)
          const l = t.viewQuery
          if ((null !== l && gs(2, l, r), !i))
            if (o) {
              const n = t.viewCheckHooks
              null !== n && yn(e, n)
            } else {
              const n = t.viewHooks
              null !== n && vn(e, n, 2), _n(e, 2)
            }
          !0 === t.firstUpdatePass && (t.firstUpdatePass = !1),
            i || (e[2] &= -73)
        } finally {
          dn()
        }
      }
      function Lr (t, e, n, r) {
        const s = e[10],
          i = !Je(),
          o = Fe(e)
        try {
          i && !o && s.begin && s.begin(), o && Fr(t, e, r), Ur(t, e, n, r)
        } finally {
          i && !o && s.end && s.end()
        }
      }
      function $r (t, e, n, r, s) {
        const i = pn()
        try {
          fn(-1), 2 & r && e.length > 19 && kr(t, e, 0, Je()), n(r, s)
        } finally {
          fn(i)
        }
      }
      function Hr (t, e, n) {
        Ge() &&
          ((function (t, e, n, r) {
            const s = n.directiveStart,
              i = n.directiveEnd
            t.firstCreatePass || Un(n, e), dr(r, e)
            const o = n.initialInputs
            for (let a = s; a < i; a++) {
              const r = t.data[a],
                i = Te(r)
              i && ss(e, n, r)
              const l = Zn(e, t, a, n)
              dr(l, e),
                null !== o && is(0, a - s, l, r, 0, o),
                i && (Ve(n.index, e)[8] = l)
            }
          })(t, e, n, Re(n, e)),
          128 == (128 & n.flags) &&
            (function (t, e, n) {
              const r = n.directiveStart,
                s = n.directiveEnd,
                i = t.expandoInstructions,
                o = t.firstCreatePass,
                a = n.index - 19
              try {
                fn(a)
                for (let n = r; n < s; n++) {
                  const r = t.data[n],
                    s = e[n]
                  null !== r.hostBindings ||
                  0 !== r.hostVars ||
                  null !== r.hostAttrs
                    ? Yr(r, s)
                    : o && i.push(null)
                }
              } finally {
                fn(-1)
              }
            })(t, e, n))
      }
      function Gr (t, e, n = Re) {
        const r = e.localNames
        if (null !== r) {
          let s = e.index + 1
          for (let i = 0; i < r.length; i += 2) {
            const o = r[i + 1],
              a = -1 === o ? n(e, t) : t[o]
            t[s++] = a
          }
        }
      }
      function zr (t) {
        return (
          t.tView ||
          (t.tView = qr(
            1,
            -1,
            t.template,
            t.decls,
            t.vars,
            t.directiveDefs,
            t.pipeDefs,
            t.viewQuery,
            t.schemas,
            t.consts
          ))
        )
      }
      function qr (t, e, n, r, s, i, o, a, l, u) {
        const c = 19 + r,
          h = c + s,
          d = (function (t, e) {
            const n = []
            for (let r = 0; r < e; r++) n.push(r < t ? null : xr)
            return n
          })(c, h)
        return (d[1] = {
          type: t,
          id: e,
          blueprint: d,
          template: n,
          queries: null,
          viewQuery: a,
          node: null,
          data: d.slice().fill(null, c),
          bindingStartIndex: c,
          expandoStartIndex: h,
          expandoInstructions: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: 'function' == typeof i ? i() : i,
          pipeRegistry: 'function' == typeof o ? o() : o,
          firstChild: null,
          schemas: l,
          consts: u
        })
      }
      function Br (t, e, n, r, s, i) {
        return {
          type: n,
          index: r,
          injectorIndex: e ? e.injectorIndex : -1,
          directiveStart: -1,
          directiveEnd: -1,
          directiveStylingLast: -1,
          propertyBindings: null,
          flags: 0,
          providerIndexes: 0,
          tagName: s,
          attrs: i,
          mergedAttrs: null,
          localNames: null,
          initialInputs: void 0,
          inputs: null,
          outputs: null,
          tViews: null,
          next: null,
          projectionNext: null,
          child: null,
          parent: e,
          projection: null,
          styles: null,
          residualStyles: void 0,
          classes: null,
          residualClasses: void 0,
          classBindings: 0,
          styleBindings: 0
        }
      }
      function Wr (t, e, n) {
        for (let r in t)
          if (t.hasOwnProperty(r)) {
            const s = t[r]
            ;(n = null === n ? {} : n).hasOwnProperty(r)
              ? n[r].push(e, s)
              : (n[r] = [e, s])
          }
        return n
      }
      function Zr (t, e, n, r, s, i, o, a) {
        const l = Re(e, n)
        let u,
          c = e.inputs
        var h
        !a && null != c && (u = c[r])
          ? (ws(t, n, u, r, s),
            xe(e) &&
              (function (t, e) {
                const n = Ve(e, t)
                16 & n[2] || (n[2] |= 64)
              })(n, e.index))
          : 3 === e.type &&
            ((r =
              'class' === (h = r)
                ? 'className'
                : 'for' === h
                ? 'htmlFor'
                : 'formaction' === h
                ? 'formAction'
                : 'innerHtml' === h
                ? 'innerHTML'
                : 'readonly' === h
                ? 'readOnly'
                : 'tabindex' === h
                ? 'tabIndex'
                : h),
            (s = null != o ? o(s, e.tagName || '', r) : s),
            Oe(i)
              ? i.setProperty(l, r, s)
              : En(r) || (l.setProperty ? l.setProperty(r, s) : (l[r] = s)))
      }
      function Qr (t, e, n, r) {
        let s = !1
        if (Ge()) {
          const i = (function (t, e, n) {
              const r = t.directiveRegistry
              let s = null
              if (r)
                for (let i = 0; i < r.length; i++) {
                  const o = r[i]
                  br(n, o.selectors, !1) &&
                    (s || (s = []),
                    Gn(Un(n, e), t, o.type),
                    Te(o)
                      ? (2 & n.flags && pr(n), ts(t, n), s.unshift(o))
                      : s.push(o))
                }
              return s
            })(t, e, n),
            o = null === r ? null : { '': -1 }
          if (null !== i) {
            let r = 0
            ;(s = !0), ns(n, t.data.length, i.length)
            for (let t = 0; t < i.length; t++) {
              const e = i[t]
              e.providersResolver && e.providersResolver(e)
            }
            Xr(t, n, i.length)
            let a = !1,
              l = !1
            for (let s = 0; s < i.length; s++) {
              const u = i[s]
              ;(n.mergedAttrs = Tn(n.mergedAttrs, u.hostAttrs)),
                rs(t, e, u),
                es(t.data.length - 1, u, o),
                null !== u.contentQueries && (n.flags |= 8),
                (null === u.hostBindings &&
                  null === u.hostAttrs &&
                  0 === u.hostVars) ||
                  (n.flags |= 128),
                !a &&
                  (u.onChanges || u.onInit || u.doCheck) &&
                  ((t.preOrderHooks || (t.preOrderHooks = [])).push(
                    n.index - 19
                  ),
                  (a = !0)),
                l ||
                  (!u.onChanges && !u.doCheck) ||
                  ((t.preOrderCheckHooks || (t.preOrderCheckHooks = [])).push(
                    n.index - 19
                  ),
                  (l = !0)),
                Jr(t, u),
                (r += u.hostVars)
            }
            !(function (t, e) {
              const n = e.directiveEnd,
                r = t.data,
                s = e.attrs,
                i = []
              let o = null,
                a = null
              for (let l = e.directiveStart; l < n; l++) {
                const t = r[l],
                  e = t.inputs
                i.push(null !== s ? os(e, s) : null),
                  (o = Wr(e, l, o)),
                  (a = Wr(t.outputs, l, a))
              }
              null !== o &&
                (o.hasOwnProperty('class') && (e.flags |= 16),
                o.hasOwnProperty('style') && (e.flags |= 32)),
                (e.initialInputs = i),
                (e.inputs = o),
                (e.outputs = a)
            })(t, n),
              Kr(t, e, r)
          }
          o &&
            (function (t, e, n) {
              if (e) {
                const r = (t.localNames = [])
                for (let t = 0; t < e.length; t += 2) {
                  const s = n[e[t + 1]]
                  if (null == s)
                    throw new Error(`Export of name '${e[t + 1]}' not found!`)
                  r.push(e[t], s)
                }
              }
            })(n, r, o)
        }
        return (n.mergedAttrs = Tn(n.mergedAttrs, n.attrs)), s
      }
      function Jr (t, e) {
        const n = t.expandoInstructions
        n.push(e.hostBindings), 0 !== e.hostVars && n.push(e.hostVars)
      }
      function Kr (t, e, n) {
        for (let r = 0; r < n; r++)
          e.push(xr), t.blueprint.push(xr), t.data.push(null)
      }
      function Yr (t, e) {
        null !== t.hostBindings && t.hostBindings(1, e)
      }
      function Xr (t, e, n) {
        const r = 19 - e.index,
          s = t.data.length - (65535 & e.providerIndexes)
        ;(t.expandoInstructions || (t.expandoInstructions = [])).push(r, s, n)
      }
      function ts (t, e) {
        ;(e.flags |= 2), (t.components || (t.components = [])).push(e.index)
      }
      function es (t, e, n) {
        if (n) {
          if (e.exportAs)
            for (let r = 0; r < e.exportAs.length; r++) n[e.exportAs[r]] = t
          Te(e) && (n[''] = t)
        }
      }
      function ns (t, e, n) {
        ;(t.flags |= 1),
          (t.directiveStart = e),
          (t.directiveEnd = e + n),
          (t.providerIndexes = e)
      }
      function rs (t, e, n) {
        t.data.push(n)
        const r = n.factory || (n.factory = _e(n.type)),
          s = new Cn(r, Te(n), null)
        t.blueprint.push(s), e.push(s)
      }
      function ss (t, e, n) {
        const r = Re(e, t),
          s = zr(n),
          i = t[10],
          o = hs(
            t,
            Vr(t, s, null, n.onPush ? 64 : 16, r, e, i, i.createRenderer(r, n))
          )
        t[e.index] = o
      }
      function is (t, e, n, r, s, i) {
        const o = i[e]
        if (null !== o) {
          const t = r.setInput
          for (let e = 0; e < o.length; ) {
            const s = o[e++],
              i = o[e++],
              a = o[e++]
            null !== t ? r.setInput(n, a, s, i) : (n[i] = a)
          }
        }
      }
      function os (t, e) {
        let n = null,
          r = 0
        for (; r < e.length; ) {
          const s = e[r]
          if (0 !== s)
            if (5 !== s) {
              if ('number' == typeof s) break
              t.hasOwnProperty(s) &&
                (null === n && (n = []), n.push(s, t[s], e[r + 1])),
                (r += 2)
            } else r += 2
          else r += 4
        }
        return n
      }
      function as (t, e, n, r) {
        return new Array(t, !0, -2, e, null, null, r, n, null)
      }
      function ls (t, e) {
        const n = t[5]
        for (let r = 0; r < n.length; r++) {
          const t = n[r],
            s = t[3][3][16]
          if (s !== e && 0 == (16 & s[2])) {
            const e = t[1]
            Ur(e, t, e.template, t[8])
          }
        }
      }
      function us (t, e) {
        const n = Ve(e, t)
        if (Ue(n) && 80 & n[2]) {
          const t = n[1]
          Ur(t, n, t.template, n[8])
        }
      }
      function cs (t, e) {
        const n = Ve(e, t),
          r = n[1]
        !(function (t, e) {
          for (let n = e.length; n < t.blueprint.length; n++)
            e.push(t.blueprint[n])
        })(r, n),
          Fr(r, n, n[8])
      }
      function hs (t, e) {
        return t[13] ? (t[14][4] = e) : (t[13] = e), (t[14] = e), e
      }
      function ds (t) {
        for (; t; ) {
          t[2] |= 64
          const e = Er(t)
          if (ke(t) && !e) return t
          t = e
        }
        return null
      }
      function ps (t, e, n) {
        const r = e[10]
        r.begin && r.begin()
        try {
          Ur(t, e, t.template, n)
        } catch (s) {
          throw (_s(e, s), s)
        } finally {
          r.end && r.end()
        }
      }
      function fs (t) {
        !(function (t) {
          for (let e = 0; e < t.components.length; e++) {
            const n = t.components[e],
              r = je(n),
              s = r[1]
            Lr(s, r, s.template, n)
          }
        })(t[8])
      }
      function gs (t, e, n) {
        sn(0), e(t, n)
      }
      const ms = (() => Promise.resolve(null))()
      function ys (t) {
        return t[7] || (t[7] = [])
      }
      function vs (t) {
        return t.cleanup || (t.cleanup = [])
      }
      function _s (t, e) {
        const n = t[9],
          r = n ? n.get(nr, null) : null
        r && r.handleError(e)
      }
      function ws (t, e, n, r, s) {
        for (let i = 0; i < n.length; ) {
          const o = n[i++],
            a = n[i++],
            l = e[o],
            u = t.data[o]
          null !== u.setInput ? u.setInput(l, s, r, a) : (l[a] = s)
        }
      }
      function bs (t, e, n) {
        const r = Pe(e, t),
          s = t[11]
        Oe(s) ? s.setValue(r, n) : (r.textContent = n)
      }
      function Cs (t, e) {
        const n = e[3]
        return -1 === t.index ? (Ce(n) ? n : null) : n
      }
      function Ss (t, e) {
        const n = Cs(t, e)
        return n ? Ns(e[11], n[7]) : null
      }
      function xs (t, e, n, r, s) {
        if (null != r) {
          let i,
            o = !1
          Ce(r) ? (i = r) : be(r) && ((o = !0), (r = r[0]))
          const a = Me(r)
          0 === t && null !== n
            ? null == s
              ? Ps(e, n, a)
              : Ms(e, n, a, s || null)
            : 1 === t && null !== n
            ? Ms(e, n, a, s || null)
            : 2 === t
            ? (function (t, e, n) {
                const r = Ns(t, e)
                r &&
                  (function (t, e, n, r) {
                    Oe(t) ? t.removeChild(e, n, r) : e.removeChild(n)
                  })(t, r, e, n)
              })(e, a, o)
            : 3 === t && e.destroyNode(a),
            null != i &&
              (function (t, e, n, r, s) {
                const i = n[7]
                i !== Me(n) && xs(e, t, r, i, s)
                for (let o = 9; o < n.length; o++) {
                  const s = n[o]
                  Fs(s[1], s, t, e, r, i)
                }
              })(e, t, i, n, s)
        }
      }
      function Es (t, e, n, r) {
        const s = Ss(t.node, e)
        s && Fs(t, e, e[11], n ? 1 : 2, s, r)
      }
      function Ts (t, e) {
        const n = t[5],
          r = n.indexOf(e)
        n.splice(r, 1)
      }
      function ks (t, e) {
        if (t.length <= 9) return
        const n = 9 + e,
          r = t[n]
        if (r) {
          const s = r[17]
          null !== s && s !== t && Ts(s, r), e > 0 && (t[n - 1][4] = r[4])
          const i = ee(t, 9 + e)
          Es(r[1], r, !1, null)
          const o = i[5]
          null !== o && o.detachView(i[1]),
            (r[3] = null),
            (r[4] = null),
            (r[2] &= -129)
        }
        return r
      }
      function As (t, e) {
        if (!(256 & e[2])) {
          const n = e[11]
          Oe(n) && n.destroyNode && Fs(t, e, n, 3, null, null),
            (function (t) {
              let e = t[13]
              if (!e) return Is(t[1], t)
              for (; e; ) {
                let n = null
                if (be(e)) n = e[13]
                else {
                  const t = e[9]
                  t && (n = t)
                }
                if (!n) {
                  for (; e && !e[4] && e !== t; )
                    be(e) && Is(e[1], e), (e = Os(e, t))
                  null === e && (e = t), be(e) && Is(e[1], e), (n = e && e[4])
                }
                e = n
              }
            })(e)
        }
      }
      function Os (t, e) {
        let n
        return be(t) && (n = t[6]) && 2 === n.type
          ? Cs(n, t)
          : t[3] === e
          ? null
          : t[3]
      }
      function Is (t, e) {
        if (!(256 & e[2])) {
          ;(e[2] &= -129),
            (e[2] |= 256),
            (function (t, e) {
              let n
              if (null != t && null != (n = t.destroyHooks))
                for (let r = 0; r < n.length; r += 2) {
                  const t = e[n[r]]
                  t instanceof Cn || n[r + 1].call(t)
                }
            })(t, e),
            (function (t, e) {
              const n = t.cleanup
              if (null !== n) {
                const t = e[7]
                for (let r = 0; r < n.length - 1; r += 2)
                  if ('string' == typeof n[r]) {
                    const s = n[r + 1],
                      i = 'function' == typeof s ? s(e) : Me(e[s]),
                      o = t[n[r + 2]],
                      a = n[r + 3]
                    'boolean' == typeof a
                      ? i.removeEventListener(n[r], o, a)
                      : a >= 0
                      ? t[a]()
                      : t[-a].unsubscribe(),
                      (r += 2)
                  } else n[r].call(t[n[r + 1]])
                e[7] = null
              }
            })(t, e)
          const n = e[6]
          n && 3 === n.type && Oe(e[11]) && e[11].destroy()
          const r = e[17]
          if (null !== r && Ce(e[3])) {
            r !== e[3] && Ts(r, e)
            const n = e[5]
            null !== n && n.detachView(t)
          }
        }
      }
      function Ms (t, e, n, r) {
        Oe(t) ? t.insertBefore(e, n, r) : e.insertBefore(n, r, !0)
      }
      function Ps (t, e, n) {
        Oe(t) ? t.appendChild(e, n) : e.appendChild(n)
      }
      function Rs (t, e, n, r) {
        null !== r ? Ms(t, e, n, r) : Ps(t, e, n)
      }
      function Ns (t, e) {
        return Oe(t) ? t.parentNode(e) : e.parentNode
      }
      function Ds (t, e, n, r) {
        const s = (function (t, e, n) {
          let r = e.parent
          for (; null != r && (4 === r.type || 5 === r.type); )
            r = (e = r).parent
          if (null == r) {
            const t = n[6]
            return 2 === t.type ? Ss(t, n) : n[0]
          }
          if (e && 5 === e.type && 4 & e.flags) return Re(e, n).parentNode
          if (2 & r.flags) {
            const e = t.data,
              n = e[e[r.index].directiveStart].encapsulation
            if (n !== oe.ShadowDom && n !== oe.Native) return null
          }
          return Re(r, n)
        })(t, r, e)
        if (null != s) {
          const t = e[11],
            i = (function (t, e) {
              if (2 === t.type) {
                const n = Cs(t, e)
                return null === n ? null : Vs(n.indexOf(e, 9) - 9, n)
              }
              return 4 === t.type || 5 === t.type ? Re(t, e) : null
            })(r.parent || e[6], e)
          if (Array.isArray(n))
            for (let e = 0; e < n.length; e++) Rs(t, s, n[e], i)
          else Rs(t, s, n, i)
        }
      }
      function Vs (t, e) {
        const n = 9 + t + 1
        if (n < e.length) {
          const t = e[n],
            r = t[1].firstChild
          if (null !== r)
            return (function t (e, n) {
              if (null !== n) {
                const r = n.type
                if (3 === r) return Re(n, e)
                if (0 === r) return Vs(-1, e[n.index])
                if (4 === r || 5 === r) {
                  const r = n.child
                  if (null !== r) return t(e, r)
                  {
                    const t = e[n.index]
                    return Ce(t) ? Vs(-1, t) : Me(t)
                  }
                }
                {
                  const r = e[16],
                    s = r[6],
                    i = Er(r),
                    o = s.projection[n.projection]
                  return null != o ? t(i, o) : t(e, n.next)
                }
              }
              return null
            })(t, r)
        }
        return e[7]
      }
      function js (t, e, n, r, s, i, o) {
        for (; null != n; ) {
          const a = r[n.index],
            l = n.type
          o && 0 === e && (a && dr(Me(a), r), (n.flags |= 4)),
            64 != (64 & n.flags) &&
              (4 === l || 5 === l
                ? (js(t, e, n.child, r, s, i, !1), xs(e, t, s, a, i))
                : 1 === l
                ? Us(t, e, r, n, s, i)
                : xs(e, t, s, a, i)),
            (n = o ? n.projectionNext : n.next)
        }
      }
      function Fs (t, e, n, r, s, i) {
        js(n, r, t.node.child, e, s, i, !1)
      }
      function Us (t, e, n, r, s, i) {
        const o = n[16],
          a = o[6].projection[r.projection]
        if (Array.isArray(a))
          for (let l = 0; l < a.length; l++) xs(e, t, s, a[l], i)
        else js(t, e, a, o[3], s, i, !0)
      }
      function Ls (t, e, n) {
        Oe(t) ? t.setAttribute(e, 'style', n) : (e.style.cssText = n)
      }
      function $s (t, e, n) {
        Oe(t)
          ? '' === n
            ? t.removeAttribute(e, 'class')
            : t.setAttribute(e, 'class', n)
          : (e.className = n)
      }
      class Hs {
        constructor (t, e) {
          ;(this._lView = t),
            (this._cdRefInjectingView = e),
            (this._appRef = null),
            (this._viewContainerRef = null),
            (this._tViewNode = null)
        }
        get rootNodes () {
          const t = this._lView
          return null == t[0]
            ? (function t (e, n, r, s, i = !1) {
                for (; null !== r; ) {
                  const o = n[r.index]
                  if ((null !== o && s.push(Me(o)), Ce(o)))
                    for (let e = 9; e < o.length; e++) {
                      const n = o[e],
                        r = n[1].firstChild
                      null !== r && t(n[1], n, r, s)
                    }
                  const a = r.type
                  if (4 === a || 5 === a) t(e, n, r.child, s)
                  else if (1 === a) {
                    const e = n[16],
                      i = e[6],
                      o = Er(e)
                    let a = i.projection[r.projection]
                    null !== a && null !== o && t(o[1], o, a, s, !0)
                  }
                  r = i ? r.projectionNext : r.next
                }
                return s
              })(t[1], t, t[6].child, [])
            : []
        }
        get context () {
          return this._lView[8]
        }
        get destroyed () {
          return 256 == (256 & this._lView[2])
        }
        destroy () {
          if (this._appRef) this._appRef.detachView(this)
          else if (this._viewContainerRef) {
            const t = this._viewContainerRef.indexOf(this)
            t > -1 && this._viewContainerRef.detach(t),
              (this._viewContainerRef = null)
          }
          As(this._lView[1], this._lView)
        }
        onDestroy (t) {
          var e, n, r
          ;(e = this._lView[1]),
            (r = t),
            ys((n = this._lView)).push(r),
            e.firstCreatePass && vs(e).push(n[7].length - 1, null)
        }
        markForCheck () {
          ds(this._cdRefInjectingView || this._lView)
        }
        detach () {
          this._lView[2] &= -129
        }
        reattach () {
          this._lView[2] |= 128
        }
        detectChanges () {
          ps(this._lView[1], this._lView, this.context)
        }
        checkNoChanges () {
          !(function (t, e, n) {
            Ke(!0)
            try {
              ps(t, e, n)
            } finally {
              Ke(!1)
            }
          })(this._lView[1], this._lView, this.context)
        }
        attachToViewContainerRef (t) {
          if (this._appRef)
            throw new Error(
              'This view is already attached directly to the ApplicationRef!'
            )
          this._viewContainerRef = t
        }
        detachFromAppRef () {
          var t
          ;(this._appRef = null),
            Fs(this._lView[1], (t = this._lView), t[11], 2, null, null)
        }
        attachToAppRef (t) {
          if (this._viewContainerRef)
            throw new Error('This view is already attached to a ViewContainer!')
          this._appRef = t
        }
      }
      class Gs extends Hs {
        constructor (t) {
          super(t), (this._view = t)
        }
        detectChanges () {
          fs(this._view)
        }
        checkNoChanges () {
          !(function (t) {
            Ke(!0)
            try {
              fs(t)
            } finally {
              Ke(!1)
            }
          })(this._view)
        }
        get context () {
          return null
        }
      }
      let zs, qs, Bs
      function Ws (t, e, n) {
        return zs || (zs = class extends t {}), new zs(Re(e, n))
      }
      function Zs (t, e, n, r) {
        return (
          qs ||
            (qs = class extends t {
              constructor (t, e, n) {
                super(),
                  (this._declarationView = t),
                  (this._declarationTContainer = e),
                  (this.elementRef = n)
              }
              createEmbeddedView (t) {
                const e = this._declarationTContainer.tViews,
                  n = Vr(this._declarationView, e, t, 16, null, e.node)
                n[17] = this._declarationView[this._declarationTContainer.index]
                const r = this._declarationView[5]
                null !== r && (n[5] = r.createEmbeddedView(e)), Fr(e, n, t)
                const s = new Hs(n)
                return (s._tViewNode = n[6]), s
              }
            }),
          0 === n.type ? new qs(r, n, Ws(e, n, r)) : null
        )
      }
      function Qs (t, e, n, r) {
        let s
        Bs ||
          (Bs = class extends t {
            constructor (t, e, n) {
              super(),
                (this._lContainer = t),
                (this._hostTNode = e),
                (this._hostView = n)
            }
            get element () {
              return Ws(e, this._hostTNode, this._hostView)
            }
            get injector () {
              return new Kn(this._hostTNode, this._hostView)
            }
            get parentInjector () {
              const t = Hn(this._hostTNode, this._hostView),
                e = Mn(t, this._hostView),
                n = (function (t, e, n) {
                  if (n.parent && -1 !== n.parent.injectorIndex) {
                    const t = n.parent.injectorIndex
                    let e = n.parent
                    for (; null != e.parent && t == e.parent.injectorIndex; )
                      e = e.parent
                    return e
                  }
                  let r = In(t),
                    s = e,
                    i = e[6]
                  for (; r > 1; ) (s = s[15]), (i = s[6]), r--
                  return i
                })(t, this._hostView, this._hostTNode)
              return An(t) && null != n
                ? new Kn(n, e)
                : new Kn(null, this._hostView)
            }
            clear () {
              for (; this.length > 0; ) this.remove(this.length - 1)
            }
            get (t) {
              return (
                (null !== this._lContainer[8] && this._lContainer[8][t]) || null
              )
            }
            get length () {
              return this._lContainer.length - 9
            }
            createEmbeddedView (t, e, n) {
              const r = t.createEmbeddedView(e || {})
              return this.insert(r, n), r
            }
            createComponent (t, e, n, r, s) {
              const i = n || this.parentInjector
              if (!s && null == t.ngModule && i) {
                const t = i.get(Kt, null)
                t && (s = t)
              }
              const o = t.create(i, r, void 0, s)
              return this.insert(o.hostView, e), o
            }
            insert (t, e) {
              const n = t._lView,
                r = n[1]
              if (t.destroyed)
                throw new Error(
                  'Cannot insert a destroyed View in a ViewContainer!'
                )
              if ((this.allocateContainerIfNeeded(), Ce(n[3]))) {
                const e = this.indexOf(t)
                if (-1 !== e) this.detach(e)
                else {
                  const e = n[3],
                    r = new Bs(e, e[6], e[3])
                  r.detach(r.indexOf(t))
                }
              }
              const s = this._adjustIndex(e)
              return (
                (function (t, e, n, r) {
                  const s = 9 + r,
                    i = n.length
                  r > 0 && (n[s - 1][4] = e),
                    r < i - 9
                      ? ((e[4] = n[s]), te(n, 9 + r, e))
                      : (n.push(e), (e[4] = null)),
                    (e[3] = n)
                  const o = e[17]
                  null !== o &&
                    n !== o &&
                    (function (t, e) {
                      const n = t[5],
                        r = e[3][3][16]
                      16 != (16 & r[2]) && e[16] !== r && (t[2] |= 1),
                        null === n ? (t[5] = [e]) : n.push(e)
                    })(o, e)
                  const a = e[5]
                  null !== a && a.insertView(t), (e[2] |= 128)
                })(r, n, this._lContainer, s),
                Es(r, n, !0, Vs(s, this._lContainer)),
                t.attachToViewContainerRef(this),
                te(this._lContainer[8], s, t),
                t
              )
            }
            move (t, e) {
              if (t.destroyed)
                throw new Error(
                  'Cannot move a destroyed View in a ViewContainer!'
                )
              return this.insert(t, e)
            }
            indexOf (t) {
              const e = this._lContainer[8]
              return null !== e ? e.indexOf(t) : -1
            }
            remove (t) {
              this.allocateContainerIfNeeded()
              const e = this._adjustIndex(t, -1)
              ;(function (t, e) {
                const n = ks(t, e)
                n && As(n[1], n)
              })(this._lContainer, e),
                ee(this._lContainer[8], e)
            }
            detach (t) {
              this.allocateContainerIfNeeded()
              const e = this._adjustIndex(t, -1),
                n = ks(this._lContainer, e)
              return n && null != ee(this._lContainer[8], e) ? new Hs(n) : null
            }
            _adjustIndex (t, e = 0) {
              return null == t ? this.length + e : t
            }
            allocateContainerIfNeeded () {
              null === this._lContainer[8] && (this._lContainer[8] = [])
            }
          })
        const i = r[n.index]
        if (Ce(i))
          (s = i),
            (function (t, e) {
              t[2] = -2
            })(s)
        else {
          let t
          if (4 === n.type) t = Me(i)
          else if (((t = r[11].createComment('')), ke(r))) {
            const e = r[11],
              s = Re(n, r)
            Ms(
              e,
              Ns(e, s),
              t,
              (function (t, e) {
                return Oe(t) ? t.nextSibling(e) : e.nextSibling
              })(e, s)
            )
          } else Ds(r[1], r, t, n)
          ;(r[n.index] = s = as(i, r, t, n)), hs(r, s)
        }
        return new Bs(s, n, r)
      }
      let Js = (() => {
        class t {}
        return (t.__NG_ELEMENT_ID__ = () => Ks()), t
      })()
      const Ks = function (t = !1) {
          return (function (t, e, n) {
            if (!n && xe(t)) {
              const n = Ve(t.index, e)
              return new Hs(n, n)
            }
            return 3 === t.type || 0 === t.type || 4 === t.type || 5 === t.type
              ? new Hs(e[16], e)
              : null
          })(We(), ze(), t)
        },
        Ys = new jt('Set Injector scope.'),
        Xs = {},
        ti = {},
        ei = []
      let ni = void 0
      function ri () {
        return void 0 === ni && (ni = new Jt()), ni
      }
      function si (t, e = null, n = null, r) {
        return new ii(t, n, e || ri(), r)
      }
      class ii {
        constructor (t, e, n, r = null) {
          ;(this.parent = n),
            (this.records = new Map()),
            (this.injectorDefTypes = new Set()),
            (this.onDestroy = new Set()),
            (this._destroyed = !1)
          const s = []
          e && Xt(e, n => this.processProvider(n, t, e)),
            Xt([t], t => this.processInjectorType(t, [], s)),
            this.records.set(Ft, li(void 0, this))
          const i = this.records.get(Ys)
          ;(this.scope = null != i ? i.value : null),
            (this.source = r || ('object' == typeof t ? null : _t(t)))
        }
        get destroyed () {
          return this._destroyed
        }
        destroy () {
          this.assertNotDestroyed(), (this._destroyed = !0)
          try {
            this.onDestroy.forEach(t => t.ngOnDestroy())
          } finally {
            this.records.clear(),
              this.onDestroy.clear(),
              this.injectorDefTypes.clear()
          }
        }
        get (t, e = Ut, n = ot.Default) {
          this.assertNotDestroyed()
          const r = zt(this)
          try {
            if (!(n & ot.SkipSelf)) {
              let e = this.records.get(t)
              if (void 0 === e) {
                const n =
                  ('function' == typeof (s = t) ||
                    ('object' == typeof s && s instanceof jt)) &&
                  ht(t)
                ;(e = n && this.injectableDefInScope(n) ? li(oi(t), Xs) : null),
                  this.records.set(t, e)
              }
              if (null != e) return this.hydrate(t, e)
            }
            return (n & ot.Self ? ri() : this.parent).get(
              t,
              (e = n & ot.Optional && e === Ut ? null : e)
            )
          } catch (i) {
            if ('NullInjectorError' === i.name) {
              if (
                ((i.ngTempTokenPath = i.ngTempTokenPath || []).unshift(_t(t)),
                r)
              )
                throw i
              return (function (t, e, n, r) {
                const s = t.ngTempTokenPath
                throw (
                  (e.__source && s.unshift(e.__source),
                  (t.message = (function (t, e, n, r = null) {
                    t =
                      t && '\n' === t.charAt(0) && '\u0275' == t.charAt(1)
                        ? t.substr(2)
                        : t
                    let s = _t(e)
                    if (Array.isArray(e)) s = e.map(_t).join(' -> ')
                    else if ('object' == typeof e) {
                      let t = []
                      for (let n in e)
                        if (e.hasOwnProperty(n)) {
                          let r = e[n]
                          t.push(
                            n +
                              ':' +
                              ('string' == typeof r ? JSON.stringify(r) : _t(r))
                          )
                        }
                      s = `{${t.join(', ')}}`
                    }
                    return `${n}${r ? '(' + r + ')' : ''}[${s}]: ${t.replace(
                      Lt,
                      '\n  '
                    )}`
                  })('\n' + t.message, s, n, r)),
                  (t.ngTokenPath = s),
                  (t.ngTempTokenPath = null),
                  t)
                )
              })(i, t, 'R3InjectorError', this.source)
            }
            throw i
          } finally {
            zt(r)
          }
          var s
        }
        _resolveInjectorDefTypes () {
          this.injectorDefTypes.forEach(t => this.get(t))
        }
        toString () {
          const t = []
          return (
            this.records.forEach((e, n) => t.push(_t(n))),
            `R3Injector[${t.join(', ')}]`
          )
        }
        assertNotDestroyed () {
          if (this._destroyed)
            throw new Error('Injector has already been destroyed.')
        }
        processInjectorType (t, e, n) {
          if (!(t = St(t))) return !1
          let r = pt(t)
          const s = (null == r && t.ngModule) || void 0,
            i = void 0 === s ? t : s,
            o = -1 !== n.indexOf(i)
          if ((void 0 !== s && (r = pt(s)), null == r)) return !1
          if (null != r.imports && !o) {
            let t
            n.push(i)
            try {
              Xt(r.imports, r => {
                this.processInjectorType(r, e, n) &&
                  (void 0 === t && (t = []), t.push(r))
              })
            } finally {
            }
            if (void 0 !== t)
              for (let e = 0; e < t.length; e++) {
                const { ngModule: n, providers: r } = t[e]
                Xt(r, t => this.processProvider(t, n, r || ei))
              }
          }
          this.injectorDefTypes.add(i), this.records.set(i, li(r.factory, Xs))
          const a = r.providers
          if (null != a && !o) {
            const e = t
            Xt(a, t => this.processProvider(t, e, a))
          }
          return void 0 !== s && void 0 !== t.providers
        }
        processProvider (t, e, n) {
          let r = ci((t = St(t))) ? t : St(t && t.provide)
          const s = (function (t, e, n) {
            return ui(t) ? li(void 0, t.useValue) : li(ai(t, e, n), Xs)
          })(t, e, n)
          if (ci(t) || !0 !== t.multi) {
            const t = this.records.get(r)
            t && void 0 !== t.multi && fr()
          } else {
            let e = this.records.get(r)
            e
              ? void 0 === e.multi && fr()
              : ((e = li(void 0, Xs, !0)),
                (e.factory = () => Qt(e.multi)),
                this.records.set(r, e)),
              (r = t),
              e.multi.push(t)
          }
          this.records.set(r, s)
        }
        hydrate (t, e) {
          var n
          return (
            e.value === ti
              ? (function (t) {
                  throw new Error(`Cannot instantiate cyclic dependency! ${t}`)
                })(_t(t))
              : e.value === Xs && ((e.value = ti), (e.value = e.factory())),
            'object' == typeof e.value &&
              e.value &&
              null !== (n = e.value) &&
              'object' == typeof n &&
              'function' == typeof n.ngOnDestroy &&
              this.onDestroy.add(e.value),
            e.value
          )
        }
        injectableDefInScope (t) {
          return (
            !!t.providedIn &&
            ('string' == typeof t.providedIn
              ? 'any' === t.providedIn || t.providedIn === this.scope
              : this.injectorDefTypes.has(t.providedIn))
          )
        }
      }
      function oi (t) {
        const e = ht(t),
          n = null !== e ? e.factory : _e(t)
        if (null !== n) return n
        const r = pt(t)
        if (null !== r) return r.factory
        if (t instanceof jt)
          throw new Error(`Token ${_t(t)} is missing a \u0275prov definition.`)
        if (t instanceof Function)
          return (function (t) {
            const e = t.length
            if (e > 0) {
              const n = (function (t, e) {
                const n = []
                for (let r = 0; r < t; r++) n.push('?')
                return n
              })(e)
              throw new Error(
                `Can't resolve all parameters for ${_t(t)}: (${n.join(', ')}).`
              )
            }
            const n = (function (t) {
              const e = t && (t[ft] || t[yt] || (t[mt] && t[mt]()))
              if (e) {
                const n = (function (t) {
                  if (t.hasOwnProperty('name')) return t.name
                  const e = ('' + t).match(/^function\s*([^\s(]+)/)
                  return null === e ? '' : e[1]
                })(t)
                return (
                  console.warn(
                    `DEPRECATED: DI is instantiating a token "${n}" that inherits its @Injectable decorator but does not provide one itself.\n` +
                      `This will become an error in v10. Please add @Injectable() to the "${n}" class.`
                  ),
                  e
                )
              }
              return null
            })(t)
            return null !== n ? () => n.factory(t) : () => new t()
          })(t)
        throw new Error('unreachable')
      }
      function ai (t, e, n) {
        let r = void 0
        if (ci(t)) {
          const e = St(t)
          return _e(e) || oi(e)
        }
        if (ui(t)) r = () => St(t.useValue)
        else if ((s = t) && s.useFactory)
          r = () => t.useFactory(...Qt(t.deps || []))
        else if (
          (function (t) {
            return !(!t || !t.useExisting)
          })(t)
        )
          r = () => Wt(St(t.useExisting))
        else {
          const s = St(t && (t.useClass || t.provide))
          if (
            (s ||
              (function (t, e, n) {
                let r = ''
                throw (
                  (t &&
                    e &&
                    (r = ` - only instances of Provider and Type are allowed, got: [${e
                      .map(t => (t == n ? '?' + n + '?' : '...'))
                      .join(', ')}]`),
                  new Error(`Invalid provider for the NgModule '${_t(t)}'` + r))
                )
              })(e, n, t),
            !(function (t) {
              return !!t.deps
            })(t))
          )
            return _e(s) || oi(s)
          r = () => new s(...Qt(t.deps))
        }
        var s
        return r
      }
      function li (t, e, n = !1) {
        return { factory: t, value: e, multi: n ? [] : void 0 }
      }
      function ui (t) {
        return null !== t && 'object' == typeof t && $t in t
      }
      function ci (t) {
        return 'function' == typeof t
      }
      const hi = function (t, e, n) {
        return (function (t, e = null, n = null, r) {
          const s = si(t, e, n, r)
          return s._resolveInjectorDefTypes(), s
        })({ name: n }, e, t, n)
      }
      let di = (() => {
        class t {
          static create (t, e) {
            return Array.isArray(t)
              ? hi(t, e, '')
              : hi(t.providers, t.parent, t.name || '')
          }
        }
        return (
          (t.THROW_IF_NOT_FOUND = Ut),
          (t.NULL = new Jt()),
          (t.ɵprov = ut({
            token: t,
            providedIn: 'any',
            factory: () => Wt(Ft)
          })),
          (t.__NG_ELEMENT_ID__ = -1),
          t
        )
      })()
      const pi = new jt('AnalyzeForEntryComponents')
      let fi = new Map()
      const gi = new Set()
      function mi (t) {
        return 'string' == typeof t ? t : t.text()
      }
      function yi (t, e) {
        let n = t.styles,
          r = t.classes,
          s = 0
        for (let i = 0; i < e.length; i++) {
          const t = e[i]
          'number' == typeof t
            ? (s = t)
            : 1 == s
            ? (r = wt(r, t))
            : 2 == s && (n = wt(n, t + ': ' + e[++i] + ';'))
        }
        null !== n && (t.styles = n), null !== r && (t.classes = r)
      }
      let vi = null
      function _i () {
        if (!vi) {
          const t = Ot.Symbol
          if (t && t.iterator) vi = t.iterator
          else {
            const t = Object.getOwnPropertyNames(Map.prototype)
            for (let e = 0; e < t.length; ++e) {
              const n = t[e]
              'entries' !== n &&
                'size' !== n &&
                Map.prototype[n] === Map.prototype.entries &&
                (vi = n)
            }
          }
        }
        return vi
      }
      function wi (t, e) {
        return (
          t === e ||
          ('number' == typeof t && 'number' == typeof e && isNaN(t) && isNaN(e))
        )
      }
      class bi {
        constructor (t) {
          this.wrapped = t
        }
        static wrap (t) {
          return new bi(t)
        }
        static unwrap (t) {
          return bi.isWrapped(t) ? t.wrapped : t
        }
        static isWrapped (t) {
          return t instanceof bi
        }
      }
      function Ci (t) {
        return (
          !!Si(t) && (Array.isArray(t) || (!(t instanceof Map) && _i() in t))
        )
      }
      function Si (t) {
        return null !== t && ('function' == typeof t || 'object' == typeof t)
      }
      function xi (t, e, n) {
        return (t[e] = n)
      }
      function Ei (t, e, n) {
        return !Object.is(t[e], n) && ((t[e] = n), !0)
      }
      function Ti (t, e, n, r) {
        const s = Ei(t, e, n)
        return Ei(t, e + 1, r) || s
      }
      function ki (t, e, n, r) {
        const s = ze()
        return (
          Ei(s, tn(), e) &&
            (qe(),
            (function (t, e, n, r, s, i) {
              const o = Re(t, e),
                a = e[11]
              if (null == r)
                Oe(a) ? a.removeAttribute(o, n, i) : o.removeAttribute(n)
              else {
                const e = null == s ? Pn(r) : s(r, t.tagName || '', n)
                Oe(a)
                  ? a.setAttribute(o, n, e, i)
                  : i
                  ? o.setAttributeNS(i, n, e)
                  : o.setAttribute(n, e)
              }
            })(gn(), s, t, e, n, r)),
          ki
        )
      }
      function Ai (t, e, n, r) {
        return Ei(t, tn(), n) ? e + Pn(n) + r : xr
      }
      function Oi (t, e, n, r, s, i) {
        const o = Ti(t, Xe(), n, s)
        return en(2), o ? e + Pn(n) + r + Pn(s) + i : xr
      }
      function Ii (t, e, n, r, s, i, o, a) {
        const l = ze(),
          u = qe(),
          c = t + 19,
          h = u.firstCreatePass
            ? (function (t, e, n, r, s, i, o, a, l) {
                const u = e.consts,
                  c = jr(e, n[6], t, 0, o || null, Le(u, a))
                Qr(e, n, c, Le(u, l)), mn(e, c)
                const h = (c.tViews = qr(
                    2,
                    -1,
                    r,
                    s,
                    i,
                    e.directiveRegistry,
                    e.pipeRegistry,
                    null,
                    e.schemas,
                    u
                  )),
                  d = Br(0, null, 2, -1, null, null)
                return (
                  (d.injectorIndex = c.injectorIndex),
                  (h.node = d),
                  null !== e.queries &&
                    (e.queries.template(e, c),
                    (h.queries = e.queries.embeddedTView(c))),
                  c
                )
              })(t, u, l, e, n, r, s, i, o)
            : u.data[c]
        Ze(h, !1)
        const d = l[11].createComment('')
        Ds(u, l, d, h),
          dr(d, l),
          hs(l, (l[c] = as(d, l, d, h))),
          Ee(h) && Hr(u, l, h),
          null != o && Gr(l, h, a)
      }
      function Mi (t) {
        return De(He.lFrame.contextLView, t)
      }
      function Pi (t, e = ot.Default) {
        const n = ze()
        return null == n ? Wt(t, e) : zn(We(), n, St(t), e)
      }
      function Ri () {
        throw new Error('invalid')
      }
      function Ni (t, e, n) {
        const r = ze()
        return Ei(r, tn(), e) && Zr(qe(), gn(), r, t, e, r[11], n, !1), Ni
      }
      function Di (t, e, n, r, s) {
        const i = s ? 'class' : 'style'
        ws(t, n, e.inputs[i], i, r)
      }
      function Vi (t, e, n, r) {
        const s = ze(),
          i = qe(),
          o = 19 + t,
          a = s[11],
          l = (s[o] = Dr(e, a, He.lFrame.currentNamespace)),
          u = i.firstCreatePass
            ? (function (t, e, n, r, s, i, o) {
                const a = e.consts,
                  l = Le(a, i),
                  u = jr(e, n[6], t, 3, s, l)
                return (
                  Qr(e, n, u, Le(a, o)),
                  null !== u.mergedAttrs && yi(u, u.mergedAttrs),
                  null !== e.queries && e.queries.elementStart(e, u),
                  u
                )
              })(t, i, s, 0, e, n, r)
            : i.data[o]
        Ze(u, !0)
        const c = u.mergedAttrs
        null !== c && Sn(a, l, c)
        const h = u.classes
        null !== h && $s(a, l, h)
        const d = u.styles
        null !== d && Ls(a, l, d),
          Ds(i, s, l, u),
          0 === He.lFrame.elementDepthCount && dr(l, s),
          He.lFrame.elementDepthCount++,
          Ee(u) &&
            (Hr(i, s, u),
            (function (t, e, n) {
              if (Se(e)) {
                const r = e.directiveEnd
                for (let s = e.directiveStart; s < r; s++) {
                  const e = t.data[s]
                  e.contentQueries && e.contentQueries(1, n[s], s)
                }
              }
            })(i, u, s)),
          null !== r && Gr(s, u)
      }
      function ji () {
        let t = We()
        Qe() ? (He.lFrame.isParent = !1) : ((t = t.parent), Ze(t, !1))
        const e = t
        He.lFrame.elementDepthCount--
        const n = qe()
        n.firstCreatePass && (mn(n, t), Se(t) && n.queries.elementEnd(t)),
          null !== e.classes &&
            (function (t) {
              return 0 != (16 & t.flags)
            })(e) &&
            Di(n, e, ze(), e.classes, !0),
          null !== e.styles &&
            (function (t) {
              return 0 != (32 & t.flags)
            })(e) &&
            Di(n, e, ze(), e.styles, !1)
      }
      function Fi (t, e, n, r) {
        Vi(t, e, n, r), ji()
      }
      function Ui () {
        return ze()
      }
      function Li (t) {
        return !!t && 'function' == typeof t.then
      }
      function $i (t) {
        return !!t && 'function' == typeof t.subscribe
      }
      function Hi (t, e, n = !1, r) {
        const s = ze(),
          i = qe(),
          o = We()
        return (
          (function (t, e, n, r, s, i, o = !1, a) {
            const l = Ee(r),
              u = t.firstCreatePass && (t.cleanup || (t.cleanup = [])),
              c = ys(e)
            let h = !0
            if (3 === r.type) {
              const d = Re(r, e),
                p = a ? a(d) : ae,
                f = p.target || d,
                g = c.length,
                m = a ? t => a(Me(t[r.index])).target : r.index
              if (Oe(n)) {
                let o = null
                if (
                  (!a &&
                    l &&
                    (o = (function (t, e, n, r) {
                      const s = t.cleanup
                      if (null != s)
                        for (let i = 0; i < s.length - 1; i += 2) {
                          const t = s[i]
                          if (t === n && s[i + 1] === r) {
                            const t = e[7],
                              n = s[i + 2]
                            return t.length > n ? t[n] : null
                          }
                          'string' == typeof t && (i += 2)
                        }
                      return null
                    })(t, e, s, r.index)),
                  null !== o)
                )
                  ((o.__ngLastListenerFn__ || o).__ngNextListenerFn__ = i),
                    (o.__ngLastListenerFn__ = i),
                    (h = !1)
                else {
                  i = zi(r, e, i, !1)
                  const t = n.listen(p.name || f, s, i)
                  c.push(i, t), u && u.push(s, m, g, g + 1)
                }
              } else
                (i = zi(r, e, i, !0)),
                  f.addEventListener(s, i, o),
                  c.push(i),
                  u && u.push(s, m, g, o)
            }
            const d = r.outputs
            let p
            if (h && null !== d && (p = d[s])) {
              const t = p.length
              if (t)
                for (let n = 0; n < t; n += 2) {
                  const t = e[p[n]][p[n + 1]].subscribe(i),
                    o = c.length
                  c.push(i, t), u && u.push(s, r.index, o, -(o + 1))
                }
            }
          })(i, s, s[11], o, t, e, n, r),
          Hi
        )
      }
      function Gi (t, e, n) {
        try {
          return !1 !== e(n)
        } catch (r) {
          return _s(t, r), !1
        }
      }
      function zi (t, e, n, r) {
        return function s (i) {
          if (i === Function) return n
          const o = 2 & t.flags ? Ve(t.index, e) : e
          0 == (32 & e[2]) && ds(o)
          let a = Gi(e, n, i),
            l = s.__ngNextListenerFn__
          for (; l; ) (a = Gi(e, l, i) && a), (l = l.__ngNextListenerFn__)
          return r && !1 === a && (i.preventDefault(), (i.returnValue = !1)), a
        }
      }
      function qi (t = 1) {
        return (function (t) {
          return (He.lFrame.contextLView = (function (t, e) {
            for (; t > 0; ) (e = e[15]), t--
            return e
          })(t, He.lFrame.contextLView))[8]
        })(t)
      }
      function Bi (t, e, n) {
        return Wi(t, '', e, '', n), Bi
      }
      function Wi (t, e, n, r, s) {
        const i = ze(),
          o = Ai(i, e, n, r)
        return o !== xr && Zr(qe(), gn(), i, t, o, i[11], s, !1), Wi
      }
      function Zi (t, e, n, r, s, i, o) {
        const a = ze(),
          l = Oi(a, e, n, r, s, i)
        return l !== xr && Zr(qe(), gn(), a, t, l, a[11], o, !1), Zi
      }
      const Qi = []
      function Ji (t, e, n, r, s) {
        const i = t[n + 1],
          o = null === e
        let a = r ? Or(i) : Mr(i),
          l = !1
        for (; 0 !== a && (!1 === l || o); ) {
          const n = t[a + 1]
          Ki(t[a], e) && ((l = !0), (t[a + 1] = r ? Rr(n) : Ir(n))),
            (a = r ? Or(n) : Mr(n))
        }
        l && (t[n + 1] = r ? Ir(i) : Rr(i))
      }
      function Ki (t, e) {
        return (
          null === t ||
          null == e ||
          (Array.isArray(t) ? t[1] : t) === e ||
          (!(!Array.isArray(t) || 'string' != typeof e) && se(t, e) >= 0)
        )
      }
      function Yi (t, e) {
        return (
          (function (t, e, n, r) {
            const s = ze(),
              i = qe(),
              o = en(2)
            if (
              (i.firstUpdatePass &&
                (function (t, e, n, r) {
                  const s = t.data
                  if (null === s[n + 1]) {
                    const r = s[pn() + 19],
                      i = (function (t, e) {
                        return e >= t.expandoStartIndex
                      })(t, n)
                    ;(function (t, e) {
                      return 0 != (16 & t.flags)
                    })(r) &&
                      null === e &&
                      !i &&
                      (e = !1),
                      (e = (function (t, e, n, r) {
                        const s = (function (t) {
                          const e = He.lFrame.currentDirectiveIndex
                          return -1 === e ? null : t[e]
                        })(t)
                        let i = e.residualClasses
                        if (null === s)
                          0 === e.classBindings &&
                            ((n = to((n = Xi(null, t, e, n, !0)), e.attrs, !0)),
                            (i = null))
                        else {
                          const r = e.directiveStylingLast
                          if (-1 === r || t[r] !== s)
                            if (((n = Xi(s, t, e, n, !0)), null === i)) {
                              let n = (function (t, e, n) {
                                const r = e.classBindings
                                if (0 !== Mr(r)) return t[Or(r)]
                              })(t, e)
                              void 0 !== n &&
                                Array.isArray(n) &&
                                ((n = Xi(null, t, e, n[1], !0)),
                                (n = to(n, e.attrs, !0)),
                                (function (t, e, n, r) {
                                  t[Or(e.classBindings)] = r
                                })(t, e, 0, n))
                            } else
                              i = (function (t, e, n) {
                                let r = void 0
                                const s = e.directiveEnd
                                for (
                                  let i = 1 + e.directiveStylingLast;
                                  i < s;
                                  i++
                                )
                                  r = to(r, t[i].hostAttrs, !0)
                                return to(r, e.attrs, !0)
                              })(t, e)
                        }
                        return void 0 !== i && (e.residualClasses = i), n
                      })(s, r, e)),
                      (function (t, e, n, r, s, i) {
                        let o = e.classBindings,
                          a = Or(o),
                          l = Mr(o)
                        t[r] = n
                        let u,
                          c = !1
                        if (Array.isArray(n)) {
                          const t = n
                          ;(u = t[1]), (null === u || se(t, u) > 0) && (c = !0)
                        } else u = n
                        if (s)
                          if (0 !== l) {
                            const e = Or(t[a + 1])
                            ;(t[r + 1] = Ar(e, a)),
                              0 !== e && (t[e + 1] = Pr(t[e + 1], r)),
                              (t[a + 1] = (131071 & t[a + 1]) | (r << 17))
                          } else
                            (t[r + 1] = Ar(a, 0)),
                              0 !== a && (t[a + 1] = Pr(t[a + 1], r)),
                              (a = r)
                        else
                          (t[r + 1] = Ar(l, 0)),
                            0 === a ? (a = r) : (t[l + 1] = Pr(t[l + 1], r)),
                            (l = r)
                        c && (t[r + 1] = Ir(t[r + 1])),
                          Ji(t, u, r, !0),
                          Ji(t, u, r, !1),
                          (function (t, e, n, r, s) {
                            const i = t.residualClasses
                            null != i &&
                              'string' == typeof e &&
                              se(i, e) >= 0 &&
                              (n[r + 1] = Rr(n[r + 1]))
                          })(e, u, t, r),
                          (o = Ar(a, l)),
                          (e.classBindings = o)
                      })(s, r, e, n, i)
                  }
                })(i, t, o),
              e !== xr && Ei(s, o, e))
            ) {
              let r
              null == n &&
                (r = (function () {
                  const t = He.lFrame
                  return null === t ? null : t.currentSanitizer
                })()) &&
                (n = r),
                (function (t, e, n, r, s, i, o, a) {
                  if (3 !== e.type) return
                  const l = t.data,
                    u = l[a + 1]
                  no(1 == (1 & u) ? eo(l, e, n, s, Mr(u), !0) : void 0) ||
                    (no(i) ||
                      ((function (t) {
                        return 2 == (2 & t)
                      })(u) &&
                        (i = eo(l, null, n, s, a, !0))),
                    (function (t, e, n, r, s) {
                      const i = Oe(t)
                      s
                        ? i
                          ? t.addClass(n, r)
                          : n.classList.add(r)
                        : i
                        ? t.removeClass(n, r)
                        : n.classList.remove(r)
                    })(r, 0, Pe(pn(), n), s, i))
                })(
                  i,
                  i.data[pn() + 19],
                  s,
                  s[11],
                  t,
                  (s[o + 1] = (function (t, e) {
                    return (
                      null == t ||
                        ('function' == typeof e
                          ? (t = e(t))
                          : 'string' == typeof e
                          ? (t += e)
                          : 'object' == typeof t && (t = _t(sr(t)))),
                      t
                    )
                  })(e, n)),
                  0,
                  o
                )
            }
          })(t, e, null),
          Yi
        )
      }
      function Xi (t, e, n, r, s) {
        let i = null
        const o = n.directiveEnd
        let a = n.directiveStylingLast
        for (
          -1 === a ? (a = n.directiveStart) : a++;
          a < o && ((i = e[a]), (r = to(r, i.hostAttrs, s)), i !== t);

        )
          a++
        return null !== t && (n.directiveStylingLast = a), r
      }
      function to (t, e, n) {
        const r = n ? 1 : 2
        let s = -1
        if (null !== e)
          for (let i = 0; i < e.length; i++) {
            const o = e[i]
            'number' == typeof o
              ? (s = o)
              : s === r &&
                (Array.isArray(t) || (t = void 0 === t ? [] : ['', t]),
                ne(t, o, !!n || e[++i]))
          }
        return void 0 === t ? null : t
      }
      function eo (t, e, n, r, s, i) {
        const o = null === e
        let a = void 0
        for (; s > 0; ) {
          const e = t[s],
            i = Array.isArray(e),
            l = i ? e[1] : e,
            u = null === l
          let c = n[s + 1]
          c === xr && (c = u ? Qi : void 0)
          let h = u ? re(c, r) : l === r ? c : void 0
          if ((i && !no(h) && (h = re(e, r)), no(h) && ((a = h), o))) return a
          const d = t[s + 1]
          s = o ? Or(d) : Mr(d)
        }
        if (null !== e) {
          let t = i ? e.residualClasses : e.residualStyles
          null != t && (a = re(t, r))
        }
        return a
      }
      function no (t) {
        return void 0 !== t
      }
      function ro (t, e = '') {
        const n = ze(),
          r = qe(),
          s = t + 19,
          i = r.firstCreatePass ? jr(r, n[6], t, 3, null, null) : r.data[s],
          o = (n[s] = (function (t, e) {
            return Oe(e) ? e.createText(t) : e.createTextNode(t)
          })(e, n[11]))
        Ds(r, n, o, i), Ze(i, !1)
      }
      function so (t) {
        return io('', t, ''), so
      }
      function io (t, e, n) {
        const r = ze(),
          s = Ai(r, t, e, n)
        return s !== xr && bs(r, pn(), s), io
      }
      function oo (t, e, n, r, s) {
        const i = ze(),
          o = Oi(i, t, e, n, r, s)
        return o !== xr && bs(i, pn(), o), oo
      }
      function ao (t, e) {
        const n = je(t)[1],
          r = n.data.length - 1
        mn(n, { directiveStart: r, directiveEnd: r + 1 })
      }
      function lo (t) {
        let e = Object.getPrototypeOf(t.type.prototype).constructor,
          n = !0
        const r = [t]
        for (; e; ) {
          let s = void 0
          if (Te(t)) s = e.ɵcmp || e.ɵdir
          else {
            if (e.ɵcmp) throw new Error('Directives cannot inherit Components')
            s = e.ɵdir
          }
          if (s) {
            if (n) {
              r.push(s)
              const e = t
              ;(e.inputs = uo(t.inputs)),
                (e.declaredInputs = uo(t.declaredInputs)),
                (e.outputs = uo(t.outputs))
              const n = s.hostBindings
              n && po(t, n)
              const i = s.viewQuery,
                o = s.contentQueries
              if (
                (i && co(t, i),
                o && ho(t, o),
                lt(t.inputs, s.inputs),
                lt(t.declaredInputs, s.declaredInputs),
                lt(t.outputs, s.outputs),
                Te(s) && s.data.animation)
              ) {
                const e = t.data
                e.animation = (e.animation || []).concat(s.data.animation)
              }
              ;(e.afterContentChecked =
                e.afterContentChecked || s.afterContentChecked),
                (e.afterContentInit = t.afterContentInit || s.afterContentInit),
                (e.afterViewChecked = t.afterViewChecked || s.afterViewChecked),
                (e.afterViewInit = t.afterViewInit || s.afterViewInit),
                (e.doCheck = t.doCheck || s.doCheck),
                (e.onDestroy = t.onDestroy || s.onDestroy),
                (e.onInit = t.onInit || s.onInit)
            }
            const e = s.features
            if (e)
              for (let r = 0; r < e.length; r++) {
                const s = e[r]
                s && s.ngInherit && s(t), s === lo && (n = !1)
              }
          }
          e = Object.getPrototypeOf(e)
        }
        !(function (t) {
          let e = 0,
            n = null
          for (let r = t.length - 1; r >= 0; r--) {
            const s = t[r]
            ;(s.hostVars = e += s.hostVars),
              (s.hostAttrs = Tn(s.hostAttrs, (n = Tn(n, s.hostAttrs))))
          }
        })(r)
      }
      function uo (t) {
        return t === ae ? {} : t === le ? [] : t
      }
      function co (t, e) {
        const n = t.viewQuery
        t.viewQuery = n
          ? (t, r) => {
              e(t, r), n(t, r)
            }
          : e
      }
      function ho (t, e) {
        const n = t.contentQueries
        t.contentQueries = n
          ? (t, r, s) => {
              e(t, r, s), n(t, r, s)
            }
          : e
      }
      function po (t, e) {
        const n = t.hostBindings
        t.hostBindings = n
          ? (t, r) => {
              e(t, r), n(t, r)
            }
          : e
      }
      class fo {
        constructor (t, e, n) {
          ;(this.previousValue = t),
            (this.currentValue = e),
            (this.firstChange = n)
        }
        isFirstChange () {
          return this.firstChange
        }
      }
      function go (t) {
        t.type.prototype.ngOnChanges &&
          ((t.setInput = mo),
          (t.onChanges = function () {
            const t = yo(this),
              e = t && t.current
            if (e) {
              const n = t.previous
              if (n === ae) t.previous = e
              else for (let t in e) n[t] = e[t]
              ;(t.current = null), this.ngOnChanges(e)
            }
          }))
      }
      function mo (t, e, n, r) {
        const s =
            yo(t) ||
            (function (t, e) {
              return (t.__ngSimpleChanges__ = e)
            })(t, { previous: ae, current: null }),
          i = s.current || (s.current = {}),
          o = s.previous,
          a = this.declaredInputs[n],
          l = o[a]
        ;(i[a] = new fo(l && l.currentValue, e, o === ae)), (t[r] = e)
      }
      function yo (t) {
        return t.__ngSimpleChanges__ || null
      }
      function vo (t, e, n, r, s) {
        if (((t = St(t)), Array.isArray(t)))
          for (let i = 0; i < t.length; i++) vo(t[i], e, n, r, s)
        else {
          const i = qe(),
            o = ze()
          let a = ci(t) ? t : St(t.provide),
            l = ai(t)
          const u = We(),
            c = 65535 & u.providerIndexes,
            h = u.directiveStart,
            d = u.providerIndexes >> 16
          if (ci(t) || !t.multi) {
            const r = new Cn(l, s, Pi),
              p = bo(a, e, s ? c : c + d, h)
            ;-1 === p
              ? (Gn(Un(u, o), i, a),
                _o(i, t, e.length),
                e.push(a),
                u.directiveStart++,
                u.directiveEnd++,
                s && (u.providerIndexes += 65536),
                n.push(r),
                o.push(r))
              : ((n[p] = r), (o[p] = r))
          } else {
            const p = bo(a, e, c + d, h),
              f = bo(a, e, c, c + d),
              g = p >= 0 && n[p],
              m = f >= 0 && n[f]
            if ((s && !m) || (!s && !g)) {
              Gn(Un(u, o), i, a)
              const c = (function (t, e, n, r, s) {
                const i = new Cn(t, n, Pi)
                return (
                  (i.multi = []),
                  (i.index = e),
                  (i.componentProviders = 0),
                  wo(i, s, r && !n),
                  i
                )
              })(s ? So : Co, n.length, s, r, l)
              !s && m && (n[f].providerFactory = c),
                _o(i, t, e.length),
                e.push(a),
                u.directiveStart++,
                u.directiveEnd++,
                s && (u.providerIndexes += 65536),
                n.push(c),
                o.push(c)
            } else _o(i, t, p > -1 ? p : f), wo(n[s ? f : p], l, !s && r)
            !s && r && m && n[f].componentProviders++
          }
        }
      }
      function _o (t, e, n) {
        if (ci(e) || e.useClass) {
          const r = (e.useClass || e).prototype.ngOnDestroy
          r && (t.destroyHooks || (t.destroyHooks = [])).push(n, r)
        }
      }
      function wo (t, e, n) {
        t.multi.push(e), n && t.componentProviders++
      }
      function bo (t, e, n, r) {
        for (let s = n; s < r; s++) if (e[s] === t) return s
        return -1
      }
      function Co (t, e, n, r) {
        return xo(this.multi, [])
      }
      function So (t, e, n, r) {
        const s = this.multi
        let i
        if (this.providerFactory) {
          const t = this.providerFactory.componentProviders,
            e = Zn(n, n[1], this.providerFactory.index, r)
          ;(i = e.slice(0, t)), xo(s, i)
          for (let n = t; n < e.length; n++) i.push(e[n])
        } else (i = []), xo(s, i)
        return i
      }
      function xo (t, e) {
        for (let n = 0; n < t.length; n++) e.push((0, t[n])())
        return e
      }
      function Eo (t, e = []) {
        return n => {
          n.providersResolver = (n, r) =>
            (function (t, e, n) {
              const r = qe()
              if (r.firstCreatePass) {
                const s = Te(t)
                vo(n, r.data, r.blueprint, s, !0),
                  vo(e, r.data, r.blueprint, s, !1)
              }
            })(n, r ? r(t) : t, e)
        }
      }
      go.ngInherit = !0
      class To {}
      class ko {
        resolveComponentFactory (t) {
          throw (function (t) {
            const e = Error(
              `No component factory found for ${_t(
                t
              )}. Did you add it to @NgModule.entryComponents?`
            )
            return (e.ngComponent = t), e
          })(t)
        }
      }
      let Ao = (() => {
          class t {}
          return (t.NULL = new ko()), t
        })(),
        Oo = (() => {
          class t {
            constructor (t) {
              this.nativeElement = t
            }
          }
          return (t.__NG_ELEMENT_ID__ = () => Io(t)), t
        })()
      const Io = function (t) {
        return Ws(t, We(), ze())
      }
      class Mo {}
      const Po = (function () {
        var t = { Important: 1, DashCase: 2 }
        return (t[t.Important] = 'Important'), (t[t.DashCase] = 'DashCase'), t
      })()
      let Ro = (() => {
        class t {}
        return (t.__NG_ELEMENT_ID__ = () => No()), t
      })()
      const No = function () {
        const t = ze(),
          e = Ve(We().index, t)
        return (function (t) {
          const e = t[11]
          if (Oe(e)) return e
          throw new Error(
            'Cannot inject Renderer2 when the application uses Renderer3!'
          )
        })(be(e) ? e : t)
      }
      let Do = (() => {
        class t {}
        return (
          (t.ɵprov = ut({ token: t, providedIn: 'root', factory: () => null })),
          t
        )
      })()
      class Vo {
        constructor (t) {
          ;(this.full = t),
            (this.major = t.split('.')[0]),
            (this.minor = t.split('.')[1]),
            (this.patch = t.split('.').slice(2).join('.'))
        }
      }
      const jo = new Vo('9.0.7')
      class Fo {
        constructor () {}
        supports (t) {
          return Ci(t)
        }
        create (t) {
          return new Lo(t)
        }
      }
      const Uo = (t, e) => e
      class Lo {
        constructor (t) {
          ;(this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = t || Uo)
        }
        forEachItem (t) {
          let e
          for (e = this._itHead; null !== e; e = e._next) t(e)
        }
        forEachOperation (t) {
          let e = this._itHead,
            n = this._removalsHead,
            r = 0,
            s = null
          for (; e || n; ) {
            const i = !n || (e && e.currentIndex < zo(n, r, s)) ? e : n,
              o = zo(i, r, s),
              a = i.currentIndex
            if (i === n) r--, (n = n._nextRemoved)
            else if (((e = e._next), null == i.previousIndex)) r++
            else {
              s || (s = [])
              const t = o - r,
                e = a - r
              if (t != e) {
                for (let n = 0; n < t; n++) {
                  const r = n < s.length ? s[n] : (s[n] = 0),
                    i = r + n
                  e <= i && i < t && (s[n] = r + 1)
                }
                s[i.previousIndex] = e - t
              }
            }
            o !== a && t(i, o, a)
          }
        }
        forEachPreviousItem (t) {
          let e
          for (e = this._previousItHead; null !== e; e = e._nextPrevious) t(e)
        }
        forEachAddedItem (t) {
          let e
          for (e = this._additionsHead; null !== e; e = e._nextAdded) t(e)
        }
        forEachMovedItem (t) {
          let e
          for (e = this._movesHead; null !== e; e = e._nextMoved) t(e)
        }
        forEachRemovedItem (t) {
          let e
          for (e = this._removalsHead; null !== e; e = e._nextRemoved) t(e)
        }
        forEachIdentityChange (t) {
          let e
          for (
            e = this._identityChangesHead;
            null !== e;
            e = e._nextIdentityChange
          )
            t(e)
        }
        diff (t) {
          if ((null == t && (t = []), !Ci(t)))
            throw new Error(
              `Error trying to diff '${_t(
                t
              )}'. Only arrays and iterables are allowed`
            )
          return this.check(t) ? this : null
        }
        onDestroy () {}
        check (t) {
          this._reset()
          let e,
            n,
            r,
            s = this._itHead,
            i = !1
          if (Array.isArray(t)) {
            this.length = t.length
            for (let e = 0; e < this.length; e++)
              (n = t[e]),
                (r = this._trackByFn(e, n)),
                null !== s && wi(s.trackById, r)
                  ? (i && (s = this._verifyReinsertion(s, n, r, e)),
                    wi(s.item, n) || this._addIdentityChange(s, n))
                  : ((s = this._mismatch(s, n, r, e)), (i = !0)),
                (s = s._next)
          } else
            (e = 0),
              (function (t, e) {
                if (Array.isArray(t)) for (let n = 0; n < t.length; n++) e(t[n])
                else {
                  const n = t[_i()]()
                  let r
                  for (; !(r = n.next()).done; ) e(r.value)
                }
              })(t, t => {
                ;(r = this._trackByFn(e, t)),
                  null !== s && wi(s.trackById, r)
                    ? (i && (s = this._verifyReinsertion(s, t, r, e)),
                      wi(s.item, t) || this._addIdentityChange(s, t))
                    : ((s = this._mismatch(s, t, r, e)), (i = !0)),
                  (s = s._next),
                  e++
              }),
              (this.length = e)
          return this._truncate(s), (this.collection = t), this.isDirty
        }
        get isDirty () {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          )
        }
        _reset () {
          if (this.isDirty) {
            let t, e
            for (
              t = this._previousItHead = this._itHead;
              null !== t;
              t = t._next
            )
              t._nextPrevious = t._next
            for (t = this._additionsHead; null !== t; t = t._nextAdded)
              t.previousIndex = t.currentIndex
            for (
              this._additionsHead = this._additionsTail = null,
                t = this._movesHead;
              null !== t;
              t = e
            )
              (t.previousIndex = t.currentIndex), (e = t._nextMoved)
            ;(this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null)
          }
        }
        _mismatch (t, e, n, r) {
          let s
          return (
            null === t ? (s = this._itTail) : ((s = t._prev), this._remove(t)),
            null !==
            (t =
              null === this._linkedRecords
                ? null
                : this._linkedRecords.get(n, r))
              ? (wi(t.item, e) || this._addIdentityChange(t, e),
                this._moveAfter(t, s, r))
              : null !==
                (t =
                  null === this._unlinkedRecords
                    ? null
                    : this._unlinkedRecords.get(n, null))
              ? (wi(t.item, e) || this._addIdentityChange(t, e),
                this._reinsertAfter(t, s, r))
              : (t = this._addAfter(new $o(e, n), s, r)),
            t
          )
        }
        _verifyReinsertion (t, e, n, r) {
          let s =
            null === this._unlinkedRecords
              ? null
              : this._unlinkedRecords.get(n, null)
          return (
            null !== s
              ? (t = this._reinsertAfter(s, t._prev, r))
              : t.currentIndex != r &&
                ((t.currentIndex = r), this._addToMoves(t, r)),
            t
          )
        }
        _truncate (t) {
          for (; null !== t; ) {
            const e = t._next
            this._addToRemovals(this._unlink(t)), (t = e)
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail &&
              (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail &&
              (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null)
        }
        _reinsertAfter (t, e, n) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(t)
          const r = t._prevRemoved,
            s = t._nextRemoved
          return (
            null === r ? (this._removalsHead = s) : (r._nextRemoved = s),
            null === s ? (this._removalsTail = r) : (s._prevRemoved = r),
            this._insertAfter(t, e, n),
            this._addToMoves(t, n),
            t
          )
        }
        _moveAfter (t, e, n) {
          return (
            this._unlink(t),
            this._insertAfter(t, e, n),
            this._addToMoves(t, n),
            t
          )
        }
        _addAfter (t, e, n) {
          return (
            this._insertAfter(t, e, n),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = t)
                : (this._additionsTail._nextAdded = t)),
            t
          )
        }
        _insertAfter (t, e, n) {
          const r = null === e ? this._itHead : e._next
          return (
            (t._next = r),
            (t._prev = e),
            null === r ? (this._itTail = t) : (r._prev = t),
            null === e ? (this._itHead = t) : (e._next = t),
            null === this._linkedRecords && (this._linkedRecords = new Go()),
            this._linkedRecords.put(t),
            (t.currentIndex = n),
            t
          )
        }
        _remove (t) {
          return this._addToRemovals(this._unlink(t))
        }
        _unlink (t) {
          null !== this._linkedRecords && this._linkedRecords.remove(t)
          const e = t._prev,
            n = t._next
          return (
            null === e ? (this._itHead = n) : (e._next = n),
            null === n ? (this._itTail = e) : (n._prev = e),
            t
          )
        }
        _addToMoves (t, e) {
          return t.previousIndex === e
            ? t
            : ((this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = t)
                  : (this._movesTail._nextMoved = t)),
              t)
        }
        _addToRemovals (t) {
          return (
            null === this._unlinkedRecords &&
              (this._unlinkedRecords = new Go()),
            this._unlinkedRecords.put(t),
            (t.currentIndex = null),
            (t._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = t),
                (t._prevRemoved = null))
              : ((t._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = t)),
            t
          )
        }
        _addIdentityChange (t, e) {
          return (
            (t.item = e),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = t)
                : (this._identityChangesTail._nextIdentityChange = t)),
            t
          )
        }
      }
      class $o {
        constructor (t, e) {
          ;(this.item = t),
            (this.trackById = e),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null)
        }
      }
      class Ho {
        constructor () {
          ;(this._head = null), (this._tail = null)
        }
        add (t) {
          null === this._head
            ? ((this._head = this._tail = t),
              (t._nextDup = null),
              (t._prevDup = null))
            : ((this._tail._nextDup = t),
              (t._prevDup = this._tail),
              (t._nextDup = null),
              (this._tail = t))
        }
        get (t, e) {
          let n
          for (n = this._head; null !== n; n = n._nextDup)
            if ((null === e || e <= n.currentIndex) && wi(n.trackById, t))
              return n
          return null
        }
        remove (t) {
          const e = t._prevDup,
            n = t._nextDup
          return (
            null === e ? (this._head = n) : (e._nextDup = n),
            null === n ? (this._tail = e) : (n._prevDup = e),
            null === this._head
          )
        }
      }
      class Go {
        constructor () {
          this.map = new Map()
        }
        put (t) {
          const e = t.trackById
          let n = this.map.get(e)
          n || ((n = new Ho()), this.map.set(e, n)), n.add(t)
        }
        get (t, e) {
          const n = this.map.get(t)
          return n ? n.get(t, e) : null
        }
        remove (t) {
          const e = t.trackById
          return this.map.get(e).remove(t) && this.map.delete(e), t
        }
        get isEmpty () {
          return 0 === this.map.size
        }
        clear () {
          this.map.clear()
        }
      }
      function zo (t, e, n) {
        const r = t.previousIndex
        if (null === r) return r
        let s = 0
        return n && r < n.length && (s = n[r]), r + e + s
      }
      class qo {
        constructor () {}
        supports (t) {
          return t instanceof Map || Si(t)
        }
        create () {
          return new Bo()
        }
      }
      class Bo {
        constructor () {
          ;(this._records = new Map()),
            (this._mapHead = null),
            (this._appendAfter = null),
            (this._previousMapHead = null),
            (this._changesHead = null),
            (this._changesTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null)
        }
        get isDirty () {
          return (
            null !== this._additionsHead ||
            null !== this._changesHead ||
            null !== this._removalsHead
          )
        }
        forEachItem (t) {
          let e
          for (e = this._mapHead; null !== e; e = e._next) t(e)
        }
        forEachPreviousItem (t) {
          let e
          for (e = this._previousMapHead; null !== e; e = e._nextPrevious) t(e)
        }
        forEachChangedItem (t) {
          let e
          for (e = this._changesHead; null !== e; e = e._nextChanged) t(e)
        }
        forEachAddedItem (t) {
          let e
          for (e = this._additionsHead; null !== e; e = e._nextAdded) t(e)
        }
        forEachRemovedItem (t) {
          let e
          for (e = this._removalsHead; null !== e; e = e._nextRemoved) t(e)
        }
        diff (t) {
          if (t) {
            if (!(t instanceof Map || Si(t)))
              throw new Error(
                `Error trying to diff '${_t(
                  t
                )}'. Only maps and objects are allowed`
              )
          } else t = new Map()
          return this.check(t) ? this : null
        }
        onDestroy () {}
        check (t) {
          this._reset()
          let e = this._mapHead
          if (
            ((this._appendAfter = null),
            this._forEach(t, (t, n) => {
              if (e && e.key === n)
                this._maybeAddToChanges(e, t),
                  (this._appendAfter = e),
                  (e = e._next)
              else {
                const r = this._getOrCreateRecordForKey(n, t)
                e = this._insertBeforeOrAppend(e, r)
              }
            }),
            e)
          ) {
            e._prev && (e._prev._next = null), (this._removalsHead = e)
            for (let t = e; null !== t; t = t._nextRemoved)
              t === this._mapHead && (this._mapHead = null),
                this._records.delete(t.key),
                (t._nextRemoved = t._next),
                (t.previousValue = t.currentValue),
                (t.currentValue = null),
                (t._prev = null),
                (t._next = null)
          }
          return (
            this._changesTail && (this._changesTail._nextChanged = null),
            this._additionsTail && (this._additionsTail._nextAdded = null),
            this.isDirty
          )
        }
        _insertBeforeOrAppend (t, e) {
          if (t) {
            const n = t._prev
            return (
              (e._next = t),
              (e._prev = n),
              (t._prev = e),
              n && (n._next = e),
              t === this._mapHead && (this._mapHead = e),
              (this._appendAfter = t),
              t
            )
          }
          return (
            this._appendAfter
              ? ((this._appendAfter._next = e), (e._prev = this._appendAfter))
              : (this._mapHead = e),
            (this._appendAfter = e),
            null
          )
        }
        _getOrCreateRecordForKey (t, e) {
          if (this._records.has(t)) {
            const n = this._records.get(t)
            this._maybeAddToChanges(n, e)
            const r = n._prev,
              s = n._next
            return (
              r && (r._next = s),
              s && (s._prev = r),
              (n._next = null),
              (n._prev = null),
              n
            )
          }
          const n = new Wo(t)
          return (
            this._records.set(t, n),
            (n.currentValue = e),
            this._addToAdditions(n),
            n
          )
        }
        _reset () {
          if (this.isDirty) {
            let t
            for (
              this._previousMapHead = this._mapHead, t = this._previousMapHead;
              null !== t;
              t = t._next
            )
              t._nextPrevious = t._next
            for (t = this._changesHead; null !== t; t = t._nextChanged)
              t.previousValue = t.currentValue
            for (t = this._additionsHead; null != t; t = t._nextAdded)
              t.previousValue = t.currentValue
            ;(this._changesHead = this._changesTail = null),
              (this._additionsHead = this._additionsTail = null),
              (this._removalsHead = null)
          }
        }
        _maybeAddToChanges (t, e) {
          wi(e, t.currentValue) ||
            ((t.previousValue = t.currentValue),
            (t.currentValue = e),
            this._addToChanges(t))
        }
        _addToAdditions (t) {
          null === this._additionsHead
            ? (this._additionsHead = this._additionsTail = t)
            : ((this._additionsTail._nextAdded = t), (this._additionsTail = t))
        }
        _addToChanges (t) {
          null === this._changesHead
            ? (this._changesHead = this._changesTail = t)
            : ((this._changesTail._nextChanged = t), (this._changesTail = t))
        }
        _forEach (t, e) {
          t instanceof Map
            ? t.forEach(e)
            : Object.keys(t).forEach(n => e(t[n], n))
        }
      }
      class Wo {
        constructor (t) {
          ;(this.key = t),
            (this.previousValue = null),
            (this.currentValue = null),
            (this._nextPrevious = null),
            (this._next = null),
            (this._prev = null),
            (this._nextAdded = null),
            (this._nextRemoved = null),
            (this._nextChanged = null)
        }
      }
      let Zo = (() => {
          class t {
            constructor (t) {
              this.factories = t
            }
            static create (e, n) {
              if (null != n) {
                const t = n.factories.slice()
                e = e.concat(t)
              }
              return new t(e)
            }
            static extend (e) {
              return {
                provide: t,
                useFactory: n => {
                  if (!n)
                    throw new Error(
                      'Cannot extend IterableDiffers without a parent injector'
                    )
                  return t.create(e, n)
                },
                deps: [[t, new it(), new rt()]]
              }
            }
            find (t) {
              const e = this.factories.find(e => e.supports(t))
              if (null != e) return e
              throw new Error(
                `Cannot find a differ supporting object '${t}' of type '${
                  ((n = t), n.name || typeof n)
                }'`
              )
              var n
            }
          }
          return (
            (t.ɵprov = ut({
              token: t,
              providedIn: 'root',
              factory: () => new t([new Fo()])
            })),
            t
          )
        })(),
        Qo = (() => {
          class t {
            constructor (t) {
              this.factories = t
            }
            static create (e, n) {
              if (n) {
                const t = n.factories.slice()
                e = e.concat(t)
              }
              return new t(e)
            }
            static extend (e) {
              return {
                provide: t,
                useFactory: n => {
                  if (!n)
                    throw new Error(
                      'Cannot extend KeyValueDiffers without a parent injector'
                    )
                  return t.create(e, n)
                },
                deps: [[t, new it(), new rt()]]
              }
            }
            find (t) {
              const e = this.factories.find(e => e.supports(t))
              if (e) return e
              throw new Error(`Cannot find a differ supporting object '${t}'`)
            }
          }
          return (
            (t.ɵprov = ut({
              token: t,
              providedIn: 'root',
              factory: () => new t([new qo()])
            })),
            t
          )
        })()
      const Jo = [new qo()],
        Ko = new Zo([new Fo()]),
        Yo = new Qo(Jo)
      let Xo = (() => {
        class t {}
        return (t.__NG_ELEMENT_ID__ = () => ta(t, Oo)), t
      })()
      const ta = function (t, e) {
        return Zs(t, e, We(), ze())
      }
      let ea = (() => {
        class t {}
        return (t.__NG_ELEMENT_ID__ = () => na(t, Oo)), t
      })()
      const na = function (t, e) {
          return Qs(t, e, We(), ze())
        },
        ra = {}
      class sa extends Ao {
        constructor (t) {
          super(), (this.ngModule = t)
        }
        resolveComponentFactory (t) {
          const e = ve(t)
          return new aa(e, this.ngModule)
        }
      }
      function ia (t) {
        const e = []
        for (let n in t)
          t.hasOwnProperty(n) && e.push({ propName: t[n], templateName: n })
        return e
      }
      const oa = new jt('SCHEDULER_TOKEN', {
        providedIn: 'root',
        factory: () => Nn
      })
      class aa extends To {
        constructor (t, e) {
          super(),
            (this.componentDef = t),
            (this.ngModule = e),
            (this.componentType = t.type),
            (this.selector = t.selectors.map(Sr).join(',')),
            (this.ngContentSelectors = t.ngContentSelectors
              ? t.ngContentSelectors
              : []),
            (this.isBoundToModule = !!e)
        }
        get inputs () {
          return ia(this.componentDef.inputs)
        }
        get outputs () {
          return ia(this.componentDef.outputs)
        }
        create (t, e, n, r) {
          const s = (r = r || this.ngModule)
              ? (function (t, e) {
                  return {
                    get: (n, r, s) => {
                      const i = t.get(n, ra, s)
                      return i !== ra || r === ra ? i : e.get(n, r, s)
                    }
                  }
                })(t, r.injector)
              : t,
            i = s.get(Mo, Ie),
            o = s.get(Do, null),
            a = i.createRenderer(null, this.componentDef),
            l = this.componentDef.selectors[0][0] || 'div',
            u = n
              ? (function (t, e, n) {
                  if (Oe(t)) return t.selectRootElement(e, n === oe.ShadowDom)
                  let r = 'string' == typeof e ? t.querySelector(e) : e
                  return (r.textContent = ''), r
                })(a, n, this.componentDef.encapsulation)
              : Dr(
                  l,
                  i.createRenderer(null, this.componentDef),
                  (function (t) {
                    const e = t.toLowerCase()
                    return 'svg' === e
                      ? 'http://www.w3.org/2000/svg'
                      : 'math' === e
                      ? 'http://www.w3.org/1998/MathML/'
                      : null
                  })(l)
                ),
            c = this.componentDef.onPush ? 576 : 528,
            h =
              'string' == typeof n && /^#root-ng-internal-isolated-\d+/.test(n),
            d = {
              components: [],
              scheduler: Nn,
              clean: ms,
              playerHandler: null,
              flags: 0
            },
            p = qr(0, -1, null, 1, 0, null, null, null, null, null),
            f = Vr(null, p, d, c, null, null, i, a, o, s)
          let g, m
          an(f, null)
          try {
            const t = (function (t, e, n, r, s, i) {
              const o = n[1]
              n[19] = t
              const a = jr(o, null, 0, 3, null, null),
                l = (a.mergedAttrs = e.hostAttrs)
              null !== l &&
                (yi(a, l),
                null !== t &&
                  (Sn(s, t, l),
                  null !== a.classes && $s(s, t, a.classes),
                  null !== a.styles && Ls(s, t, a.styles)))
              const u = r.createRenderer(t, e),
                c = Vr(
                  n,
                  zr(e),
                  null,
                  e.onPush ? 64 : 16,
                  n[19],
                  a,
                  r,
                  u,
                  void 0
                )
              return (
                o.firstCreatePass &&
                  (Gn(Un(a, n), o, e.type), ts(o, a), ns(a, n.length, 1)),
                hs(n, c),
                (n[19] = c)
              )
            })(u, this.componentDef, f, i, a)
            if (u)
              if (n) Sn(a, u, ['ng-version', jo.full])
              else {
                const { attrs: t, classes: e } = (function (t) {
                  const e = [],
                    n = []
                  let r = 1,
                    s = 2
                  for (; r < t.length; ) {
                    let i = t[r]
                    if ('string' == typeof i)
                      2 === s
                        ? '' !== i && e.push(i, t[++r])
                        : 8 === s && n.push(i)
                    else {
                      if (!_r(s)) break
                      s = i
                    }
                    r++
                  }
                  return { attrs: e, classes: n }
                })(this.componentDef.selectors[0])
                t && Sn(a, u, t), e && e.length > 0 && $s(a, u, e.join(' '))
              }
            ;(m = Ne(f[1], 0)),
              e && (m.projection = e.map(t => Array.from(t))),
              (g = (function (t, e, n, r, s) {
                const i = n[1],
                  o = (function (t, e, n) {
                    const r = We()
                    t.firstCreatePass &&
                      (n.providersResolver && n.providersResolver(n),
                      Xr(t, r, 1),
                      rs(t, e, n))
                    const s = Zn(e, t, e.length - 1, r)
                    dr(s, e)
                    const i = Re(r, e)
                    return i && dr(i, e), s
                  })(i, n, e)
                r.components.push(o),
                  (t[8] = o),
                  s && s.forEach(t => t(o, e)),
                  e.contentQueries && e.contentQueries(1, o, n.length - 1)
                const a = We()
                if (
                  i.firstCreatePass &&
                  (null !== e.hostBindings || null !== e.hostAttrs)
                ) {
                  fn(a.index - 19)
                  const t = n[1]
                  Jr(t, e), Kr(t, n, e.hostVars), Yr(e, o)
                }
                return o
              })(t, this.componentDef, f, d, [ao])),
              Fr(p, f, null)
          } finally {
            dn()
          }
          const y = new la(this.componentType, g, Ws(Oo, m, f), f, m)
          return (n && !h) || (y.hostView._tViewNode.child = m), y
        }
      }
      class la extends class {} {
        constructor (t, e, n, r, s) {
          super(),
            (this.location = n),
            (this._rootLView = r),
            (this._tNode = s),
            (this.destroyCbs = []),
            (this.instance = e),
            (this.hostView = this.changeDetectorRef = new Gs(r)),
            (this.hostView._tViewNode = (function (t, e, n, r) {
              let s = t.node
              return (
                null == s && (t.node = s = Br(0, null, 2, -1, null, null)),
                (r[6] = s)
              )
            })(r[1], 0, 0, r)),
            (this.componentType = t)
        }
        get injector () {
          return new Kn(this._tNode, this._rootLView)
        }
        destroy () {
          this.destroyCbs &&
            (this.destroyCbs.forEach(t => t()),
            (this.destroyCbs = null),
            !this.hostView.destroyed && this.hostView.destroy())
        }
        onDestroy (t) {
          this.destroyCbs && this.destroyCbs.push(t)
        }
      }
      const ua = void 0
      var ca = [
        'en',
        [['a', 'p'], ['AM', 'PM'], ua],
        [['AM', 'PM'], ua, ua],
        [
          ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
          ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
          ],
          ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
        ],
        ua,
        [
          ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
          [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
          ],
          [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
          ]
        ],
        ua,
        [
          ['B', 'A'],
          ['BC', 'AD'],
          ['Before Christ', 'Anno Domini']
        ],
        0,
        [6, 0],
        ['M/d/yy', 'MMM d, y', 'MMMM d, y', 'EEEE, MMMM d, y'],
        ['h:mm a', 'h:mm:ss a', 'h:mm:ss a z', 'h:mm:ss a zzzz'],
        ['{1}, {0}', ua, "{1} 'at' {0}", ua],
        [
          '.',
          ',',
          ';',
          '%',
          '+',
          '-',
          'E',
          '\xd7',
          '\u2030',
          '\u221e',
          'NaN',
          ':'
        ],
        ['#,##0.###', '#,##0%', '\xa4#,##0.00', '#E0'],
        'USD',
        '$',
        'US Dollar',
        {},
        function (t) {
          let e = Math.floor(Math.abs(t)),
            n = t.toString().replace(/^[^.]*\.?/, '').length
          return 1 === e && 0 === n ? 1 : 5
        }
      ]
      let ha = {}
      function da (t) {
        const e = (function (t) {
          return t.toLowerCase().replace(/_/g, '-')
        })(t)
        let n = pa(e)
        if (n) return n
        const r = e.split('-')[0]
        if (((n = pa(r)), n)) return n
        if ('en' === r) return ca
        throw new Error(`Missing locale data for the locale "${t}".`)
      }
      function pa (t) {
        return (
          t in ha ||
            (ha[t] =
              Ot.ng &&
              Ot.ng.common &&
              Ot.ng.common.locales &&
              Ot.ng.common.locales[t]),
          ha[t]
        )
      }
      const fa = (function () {
        var t = {
          LocaleId: 0,
          DayPeriodsFormat: 1,
          DayPeriodsStandalone: 2,
          DaysFormat: 3,
          DaysStandalone: 4,
          MonthsFormat: 5,
          MonthsStandalone: 6,
          Eras: 7,
          FirstDayOfWeek: 8,
          WeekendRange: 9,
          DateFormat: 10,
          TimeFormat: 11,
          DateTimeFormat: 12,
          NumberSymbols: 13,
          NumberFormats: 14,
          CurrencyCode: 15,
          CurrencySymbol: 16,
          CurrencyName: 17,
          Currencies: 18,
          PluralCase: 19,
          ExtraData: 20
        }
        return (
          (t[t.LocaleId] = 'LocaleId'),
          (t[t.DayPeriodsFormat] = 'DayPeriodsFormat'),
          (t[t.DayPeriodsStandalone] = 'DayPeriodsStandalone'),
          (t[t.DaysFormat] = 'DaysFormat'),
          (t[t.DaysStandalone] = 'DaysStandalone'),
          (t[t.MonthsFormat] = 'MonthsFormat'),
          (t[t.MonthsStandalone] = 'MonthsStandalone'),
          (t[t.Eras] = 'Eras'),
          (t[t.FirstDayOfWeek] = 'FirstDayOfWeek'),
          (t[t.WeekendRange] = 'WeekendRange'),
          (t[t.DateFormat] = 'DateFormat'),
          (t[t.TimeFormat] = 'TimeFormat'),
          (t[t.DateTimeFormat] = 'DateTimeFormat'),
          (t[t.NumberSymbols] = 'NumberSymbols'),
          (t[t.NumberFormats] = 'NumberFormats'),
          (t[t.CurrencyCode] = 'CurrencyCode'),
          (t[t.CurrencySymbol] = 'CurrencySymbol'),
          (t[t.CurrencyName] = 'CurrencyName'),
          (t[t.Currencies] = 'Currencies'),
          (t[t.PluralCase] = 'PluralCase'),
          (t[t.ExtraData] = 'ExtraData'),
          t
        )
      })()
      let ga = 'en-US'
      function ma (t) {
        var e, n
        ;(n = 'Expected localeId to be defined'),
          null == (e = t) &&
            (function (t, e, n, r) {
              throw new Error(
                `ASSERTION ERROR: ${t}` + ` [Expected=> null != ${e} <=Actual]`
              )
            })(n, e),
          'string' == typeof t && (ga = t.toLowerCase().replace(/_/g, '-'))
      }
      const ya = new Map()
      class va extends Kt {
        constructor (t, e) {
          super(),
            (this._parent = e),
            (this._bootstrapComponents = []),
            (this.injector = this),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new sa(this))
          const n = we(t),
            r = t[Nt] || null
          r && ma(r),
            (this._bootstrapComponents = Dn(n.bootstrap)),
            (this._r3Injector = si(
              t,
              e,
              [
                { provide: Kt, useValue: this },
                { provide: Ao, useValue: this.componentFactoryResolver }
              ],
              _t(t)
            )),
            this._r3Injector._resolveInjectorDefTypes(),
            (this.instance = this.get(t))
        }
        get (t, e = di.THROW_IF_NOT_FOUND, n = ot.Default) {
          return t === di || t === Kt || t === Ft
            ? this
            : this._r3Injector.get(t, e, n)
        }
        destroy () {
          const t = this._r3Injector
          !t.destroyed && t.destroy(),
            this.destroyCbs.forEach(t => t()),
            (this.destroyCbs = null)
        }
        onDestroy (t) {
          this.destroyCbs.push(t)
        }
      }
      class _a extends Yt {
        constructor (t) {
          super(),
            (this.moduleType = t),
            null !== we(t) &&
              (function t (e) {
                if (null !== e.ɵmod.id) {
                  const t = e.ɵmod.id
                  ;(function (t, e, n) {
                    if (e && e !== n)
                      throw new Error(
                        `Duplicate module registered for ${t} - ${_t(
                          e
                        )} vs ${_t(e.name)}`
                      )
                  })(t, ya.get(t), e),
                    ya.set(t, e)
                }
                let n = e.ɵmod.imports
                n instanceof Function && (n = n()), n && n.forEach(e => t(e))
              })(t)
        }
        create (t) {
          return new va(this.moduleType, t)
        }
      }
      function wa (t, e, n, r) {
        return (function (t, e, n, r, s, i) {
          const o = e + n
          return Ei(t, o, s)
            ? xi(t, o + 1, i ? r.call(i, s) : r(s))
            : Ca(t, o + 1)
        })(ze(), Ye(), t, e, n, r)
      }
      function ba (t, e, n, r, s) {
        return Sa(ze(), Ye(), t, e, n, r, s)
      }
      function Ca (t, e) {
        const n = t[e]
        return n === xr ? void 0 : n
      }
      function Sa (t, e, n, r, s, i, o) {
        const a = e + n
        return Ti(t, a, s, i)
          ? xi(t, a + 2, o ? r.call(o, s, i) : r(s, i))
          : Ca(t, a + 2)
      }
      function xa (t, e) {
        const n = qe()
        let r
        const s = t + 19
        n.firstCreatePass
          ? ((r = (function (t, e) {
              if (e)
                for (let n = e.length - 1; n >= 0; n--) {
                  const r = e[n]
                  if (t === r.name) return r
                }
              throw new Error(`The pipe '${t}' could not be found!`)
            })(e, n.pipeRegistry)),
            (n.data[s] = r),
            r.onDestroy &&
              (n.destroyHooks || (n.destroyHooks = [])).push(s, r.onDestroy))
          : (r = n.data[s])
        const i = r.factory || (r.factory = _e(r.type)),
          o = qt(Pi),
          a = i()
        return (
          qt(o),
          (function (t, e, n, r) {
            const s = n + 19
            s >= t.data.length && ((t.data[s] = null), (t.blueprint[s] = null)),
              (e[s] = r)
          })(n, ze(), t, a),
          a
        )
      }
      function Ea (t, e, n, r) {
        const s = ze(),
          i = De(s, t)
        return ka(
          s,
          Ta(s, t) ? Sa(s, Ye(), e, i.transform, n, r, i) : i.transform(n, r)
        )
      }
      function Ta (t, e) {
        return t[1].data[e + 19].pure
      }
      function ka (t, e) {
        return bi.isWrapped(e) && ((e = bi.unwrap(e)), (t[Xe()] = xr)), e
      }
      class Aa extends E {
        constructor (t = !1) {
          super(), (this.__isAsync = t)
        }
        emit (t) {
          super.next(t)
        }
        subscribe (t, e, n) {
          let r,
            s = t => null,
            i = () => null
          t && 'object' == typeof t
            ? ((r = this.__isAsync
                ? e => {
                    setTimeout(() => t.next(e))
                  }
                : e => {
                    t.next(e)
                  }),
              t.error &&
                (s = this.__isAsync
                  ? e => {
                      setTimeout(() => t.error(e))
                    }
                  : e => {
                      t.error(e)
                    }),
              t.complete &&
                (i = this.__isAsync
                  ? () => {
                      setTimeout(() => t.complete())
                    }
                  : () => {
                      t.complete()
                    }))
            : ((r = this.__isAsync
                ? e => {
                    setTimeout(() => t(e))
                  }
                : e => {
                    t(e)
                  }),
              e &&
                (s = this.__isAsync
                  ? t => {
                      setTimeout(() => e(t))
                    }
                  : t => {
                      e(t)
                    }),
              n &&
                (i = this.__isAsync
                  ? () => {
                      setTimeout(() => n())
                    }
                  : () => {
                      n()
                    }))
          const o = super.subscribe(r, s, i)
          return t instanceof h && t.add(o), o
        }
      }
      function Oa () {
        return this._results[_i()]()
      }
      class Ia {
        constructor () {
          ;(this.dirty = !0),
            (this._results = []),
            (this.changes = new Aa()),
            (this.length = 0)
          const t = _i(),
            e = Ia.prototype
          e[t] || (e[t] = Oa)
        }
        map (t) {
          return this._results.map(t)
        }
        filter (t) {
          return this._results.filter(t)
        }
        find (t) {
          return this._results.find(t)
        }
        reduce (t, e) {
          return this._results.reduce(t, e)
        }
        forEach (t) {
          this._results.forEach(t)
        }
        some (t) {
          return this._results.some(t)
        }
        toArray () {
          return this._results.slice()
        }
        toString () {
          return this._results.toString()
        }
        reset (t) {
          ;(this._results = (function t (e, n) {
            void 0 === n && (n = e)
            for (let r = 0; r < e.length; r++) {
              let s = e[r]
              Array.isArray(s)
                ? (n === e && (n = e.slice(0, r)), t(s, n))
                : n !== e && n.push(s)
            }
            return n
          })(t)),
            (this.dirty = !1),
            (this.length = this._results.length),
            (this.last = this._results[this.length - 1]),
            (this.first = this._results[0])
        }
        notifyOnChanges () {
          this.changes.emit(this)
        }
        setDirty () {
          this.dirty = !0
        }
        destroy () {
          this.changes.complete(), this.changes.unsubscribe()
        }
      }
      class Ma {
        constructor (t) {
          ;(this.queryList = t), (this.matches = null)
        }
        clone () {
          return new Ma(this.queryList)
        }
        setDirty () {
          this.queryList.setDirty()
        }
      }
      class Pa {
        constructor (t = []) {
          this.queries = t
        }
        createEmbeddedView (t) {
          const e = t.queries
          if (null !== e) {
            const n =
                null !== t.contentQueries ? t.contentQueries[0] : e.length,
              r = []
            for (let t = 0; t < n; t++) {
              const n = e.getByIndex(t)
              r.push(this.queries[n.indexInDeclarationView].clone())
            }
            return new Pa(r)
          }
          return null
        }
        insertView (t) {
          this.dirtyQueriesWithMatches(t)
        }
        detachView (t) {
          this.dirtyQueriesWithMatches(t)
        }
        dirtyQueriesWithMatches (t) {
          for (let e = 0; e < this.queries.length; e++)
            null !== Ha(t, e).matches && this.queries[e].setDirty()
        }
      }
      class Ra {
        constructor (t, e, n, r = null) {
          ;(this.predicate = t),
            (this.descendants = e),
            (this.isStatic = n),
            (this.read = r)
        }
      }
      class Na {
        constructor (t = []) {
          this.queries = t
        }
        elementStart (t, e) {
          for (let n = 0; n < this.queries.length; n++)
            this.queries[n].elementStart(t, e)
        }
        elementEnd (t) {
          for (let e = 0; e < this.queries.length; e++)
            this.queries[e].elementEnd(t)
        }
        embeddedTView (t) {
          let e = null
          for (let n = 0; n < this.length; n++) {
            const r = null !== e ? e.length : 0,
              s = this.getByIndex(n).embeddedTView(t, r)
            s &&
              ((s.indexInDeclarationView = n),
              null !== e ? e.push(s) : (e = [s]))
          }
          return null !== e ? new Na(e) : null
        }
        template (t, e) {
          for (let n = 0; n < this.queries.length; n++)
            this.queries[n].template(t, e)
        }
        getByIndex (t) {
          return this.queries[t]
        }
        get length () {
          return this.queries.length
        }
        track (t) {
          this.queries.push(t)
        }
      }
      class Da {
        constructor (t, e = -1) {
          ;(this.metadata = t),
            (this.matches = null),
            (this.indexInDeclarationView = -1),
            (this.crossesNgTemplate = !1),
            (this._appliesToNextNode = !0),
            (this._declarationNodeIndex = e)
        }
        elementStart (t, e) {
          this.isApplyingToNode(e) && this.matchTNode(t, e)
        }
        elementEnd (t) {
          this._declarationNodeIndex === t.index &&
            (this._appliesToNextNode = !1)
        }
        template (t, e) {
          this.elementStart(t, e)
        }
        embeddedTView (t, e) {
          return this.isApplyingToNode(t)
            ? ((this.crossesNgTemplate = !0),
              this.addMatch(-t.index, e),
              new Da(this.metadata))
            : null
        }
        isApplyingToNode (t) {
          if (this._appliesToNextNode && !1 === this.metadata.descendants) {
            const e = this._declarationNodeIndex
            let n = t.parent
            for (; null !== n && 4 === n.type && n.index !== e; ) n = n.parent
            return e === (null !== n ? n.index : -1)
          }
          return this._appliesToNextNode
        }
        matchTNode (t, e) {
          if (Array.isArray(this.metadata.predicate)) {
            const n = this.metadata.predicate
            for (let r = 0; r < n.length; r++)
              this.matchTNodeWithReadOption(t, e, Va(e, n[r]))
          } else {
            const n = this.metadata.predicate
            n === Xo
              ? 0 === e.type && this.matchTNodeWithReadOption(t, e, -1)
              : this.matchTNodeWithReadOption(t, e, Wn(e, t, n, !1, !1))
          }
        }
        matchTNodeWithReadOption (t, e, n) {
          if (null !== n) {
            const r = this.metadata.read
            if (null !== r)
              if (r === Oo || r === ea || (r === Xo && 0 === e.type))
                this.addMatch(e.index, -2)
              else {
                const n = Wn(e, t, r, !1, !1)
                null !== n && this.addMatch(e.index, n)
              }
            else this.addMatch(e.index, n)
          }
        }
        addMatch (t, e) {
          null === this.matches
            ? (this.matches = [t, e])
            : this.matches.push(t, e)
        }
      }
      function Va (t, e) {
        const n = t.localNames
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) if (n[r] === e) return n[r + 1]
        return null
      }
      function ja (t, e, n, r) {
        return -1 === n
          ? (function (t, e) {
              return 3 === t.type || 4 === t.type
                ? Ws(Oo, t, e)
                : 0 === t.type
                ? Zs(Xo, Oo, t, e)
                : null
            })(e, t)
          : -2 === n
          ? (function (t, e, n) {
              return n === Oo
                ? Ws(Oo, e, t)
                : n === Xo
                ? Zs(Xo, Oo, e, t)
                : n === ea
                ? Qs(ea, Oo, e, t)
                : void 0
            })(t, e, r)
          : Zn(t, t[1], n, e)
      }
      function Fa (t, e, n, r) {
        const s = e[5].queries[r]
        if (null === s.matches) {
          const r = t.data,
            i = n.matches,
            o = []
          for (let t = 0; t < i.length; t += 2) {
            const s = i[t]
            o.push(s < 0 ? null : ja(e, r[s], i[t + 1], n.metadata.read))
          }
          s.matches = o
        }
        return s.matches
      }
      function Ua (t) {
        const e = ze(),
          n = qe(),
          r = rn()
        sn(r + 1)
        const s = Ha(n, r)
        if (t.dirty && Fe(e) === s.metadata.isStatic) {
          if (null === s.matches) t.reset([])
          else {
            const i = s.crossesNgTemplate
              ? (function t (e, n, r, s) {
                  const i = e.queries.getByIndex(r),
                    o = i.matches
                  if (null !== o) {
                    const a = Fa(e, n, i, r)
                    for (let e = 0; e < o.length; e += 2) {
                      const r = o[e]
                      if (r > 0) s.push(a[e / 2])
                      else {
                        const i = o[e + 1],
                          a = n[-r]
                        for (let e = 9; e < a.length; e++) {
                          const n = a[e]
                          n[17] === n[3] && t(n[1], n, i, s)
                        }
                        if (null !== a[5]) {
                          const e = a[5]
                          for (let n = 0; n < e.length; n++) {
                            const r = e[n]
                            t(r[1], r, i, s)
                          }
                        }
                      }
                    }
                  }
                  return s
                })(n, e, r, [])
              : Fa(n, e, s, r)
            t.reset(i), t.notifyOnChanges()
          }
          return !0
        }
        return !1
      }
      function La (t, e, n) {
        !(function (t, e, n, r, s, i) {
          t.firstCreatePass &&
            (function (t, e, n) {
              null === t.queries && (t.queries = new Na()),
                t.queries.track(new Da(e, -1))
            })(t, new Ra(n, r, !1, s)),
            (function (t, e) {
              const n = new Ia()
              !(function (t, e, n, r) {
                const s = ys(e)
                s.push(n), t.firstCreatePass && vs(t).push(r, s.length - 1)
              })(t, e, n, n.destroy),
                null === e[5] && (e[5] = new Pa()),
                e[5].queries.push(new Ma(n))
            })(t, e)
        })(qe(), ze(), t, e, n)
      }
      function $a () {
        return (t = ze()), (e = rn()), t[5].queries[e].queryList
        var t, e
      }
      function Ha (t, e) {
        return t.queries.getByIndex(e)
      }
      function Ga (t, e) {
        return Zs(Xo, Oo, t, e)
      }
      const za = new jt('Application Initializer')
      let qa = (() => {
        class t {
          constructor (t) {
            ;(this.appInits = t),
              (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((t, e) => {
                ;(this.resolve = t), (this.reject = e)
              }))
          }
          runInitializers () {
            if (this.initialized) return
            const t = [],
              e = () => {
                ;(this.done = !0), this.resolve()
              }
            if (this.appInits)
              for (let n = 0; n < this.appInits.length; n++) {
                const e = this.appInits[n]()
                Li(e) && t.push(e)
              }
            Promise.all(t)
              .then(() => {
                e()
              })
              .catch(t => {
                this.reject(t)
              }),
              0 === t.length && e(),
              (this.initialized = !0)
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Wt(za, 8))
          }),
          (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
          t
        )
      })()
      const Ba = new jt('AppId'),
        Wa = {
          provide: Ba,
          useFactory: function () {
            return `${Za()}${Za()}${Za()}`
          },
          deps: []
        }
      function Za () {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()))
      }
      const Qa = new jt('Platform Initializer'),
        Ja = new jt('Platform ID'),
        Ka = new jt('appBootstrapListener')
      let Ya = (() => {
        class t {
          log (t) {
            console.log(t)
          }
          warn (t) {
            console.warn(t)
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)()
          }),
          (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
          t
        )
      })()
      const Xa = new jt('LocaleId'),
        tl = new jt('DefaultCurrencyCode'),
        el = (function () {
          var t = { Error: 0, Warning: 1, Ignore: 2 }
          return (
            (t[t.Error] = 'Error'),
            (t[t.Warning] = 'Warning'),
            (t[t.Ignore] = 'Ignore'),
            t
          )
        })()
      class nl {
        constructor (t, e) {
          ;(this.ngModuleFactory = t), (this.componentFactories = e)
        }
      }
      const rl = function (t) {
          return new _a(t)
        },
        sl = rl,
        il = function (t) {
          return Promise.resolve(rl(t))
        },
        ol = function (t) {
          const e = rl(t),
            n = Dn(we(t).declarations).reduce((t, e) => {
              const n = ve(e)
              return n && t.push(new aa(n)), t
            }, [])
          return new nl(e, n)
        },
        al = ol,
        ll = function (t) {
          return Promise.resolve(ol(t))
        }
      let ul = (() => {
        class t {
          constructor () {
            ;(this.compileModuleSync = sl),
              (this.compileModuleAsync = il),
              (this.compileModuleAndAllComponentsSync = al),
              (this.compileModuleAndAllComponentsAsync = ll)
          }
          clearCache () {}
          clearCacheFor (t) {}
          getModuleId (t) {}
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)()
          }),
          (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
          t
        )
      })()
      const cl = new jt('compilerOptions'),
        hl = (() => Promise.resolve(0))()
      function dl (t) {
        'undefined' == typeof Zone
          ? hl.then(() => {
              t && t.apply(null, null)
            })
          : Zone.current.scheduleMicroTask('scheduleMicrotask', t)
      }
      class pl {
        constructor ({
          enableLongStackTrace: t = !1,
          shouldCoalesceEventChangeDetection: e = !1
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new Aa(!1)),
            (this.onMicrotaskEmpty = new Aa(!1)),
            (this.onStable = new Aa(!1)),
            (this.onError = new Aa(!1)),
            'undefined' == typeof Zone)
          )
            throw new Error('In this configuration Angular requires Zone.js')
          Zone.assertZonePatched(),
            (this._nesting = 0),
            (this._outer = this._inner = Zone.current),
            Zone.wtfZoneSpec &&
              (this._inner = this._inner.fork(Zone.wtfZoneSpec)),
            Zone.TaskTrackingZoneSpec &&
              (this._inner = this._inner.fork(new Zone.TaskTrackingZoneSpec())),
            t &&
              Zone.longStackTraceZoneSpec &&
              (this._inner = this._inner.fork(Zone.longStackTraceZoneSpec)),
            (this.shouldCoalesceEventChangeDetection = e),
            (this.lastRequestAnimationFrameId = -1),
            (this.nativeRequestAnimationFrame = (function () {
              let t = Ot.requestAnimationFrame,
                e = Ot.cancelAnimationFrame
              if ('undefined' != typeof Zone && t && e) {
                const n = t[Zone.__symbol__('OriginalDelegate')]
                n && (t = n)
                const r = e[Zone.__symbol__('OriginalDelegate')]
                r && (e = r)
              }
              return {
                nativeRequestAnimationFrame: t,
                nativeCancelAnimationFrame: e
              }
            })().nativeRequestAnimationFrame),
            (function (t) {
              const e =
                !!t.shouldCoalesceEventChangeDetection &&
                t.nativeRequestAnimationFrame &&
                (() => {
                  !(function (t) {
                    ;-1 === t.lastRequestAnimationFrameId &&
                      ((t.lastRequestAnimationFrameId =
                        t.nativeRequestAnimationFrame.call(Ot, () => {
                          ;(t.lastRequestAnimationFrameId = -1), yl(t), ml(t)
                        })),
                      yl(t))
                  })(t)
                })
              t._inner = t._inner.fork({
                name: 'angular',
                properties: { isAngularZone: !0, maybeDelayChangeDetection: e },
                onInvokeTask: (n, r, s, i, o, a) => {
                  try {
                    return vl(t), n.invokeTask(s, i, o, a)
                  } finally {
                    e && 'eventTask' === i.type && e(), _l(t)
                  }
                },
                onInvoke: (e, n, r, s, i, o, a) => {
                  try {
                    return vl(t), e.invoke(r, s, i, o, a)
                  } finally {
                    _l(t)
                  }
                },
                onHasTask: (e, n, r, s) => {
                  e.hasTask(r, s),
                    n === r &&
                      ('microTask' == s.change
                        ? ((t._hasPendingMicrotasks = s.microTask),
                          yl(t),
                          ml(t))
                        : 'macroTask' == s.change &&
                          (t.hasPendingMacrotasks = s.macroTask))
                },
                onHandleError: (e, n, r, s) => (
                  e.handleError(r, s),
                  t.runOutsideAngular(() => t.onError.emit(s)),
                  !1
                )
              })
            })(this)
        }
        static isInAngularZone () {
          return !0 === Zone.current.get('isAngularZone')
        }
        static assertInAngularZone () {
          if (!pl.isInAngularZone())
            throw new Error('Expected to be in Angular Zone, but it is not!')
        }
        static assertNotInAngularZone () {
          if (pl.isInAngularZone())
            throw new Error('Expected to not be in Angular Zone, but it is!')
        }
        run (t, e, n) {
          return this._inner.run(t, e, n)
        }
        runTask (t, e, n, r) {
          const s = this._inner,
            i = s.scheduleEventTask('NgZoneEvent: ' + r, t, gl, fl, fl)
          try {
            return s.runTask(i, e, n)
          } finally {
            s.cancelTask(i)
          }
        }
        runGuarded (t, e, n) {
          return this._inner.runGuarded(t, e, n)
        }
        runOutsideAngular (t) {
          return this._outer.run(t)
        }
      }
      function fl () {}
      const gl = {}
      function ml (t) {
        if (0 == t._nesting && !t.hasPendingMicrotasks && !t.isStable)
          try {
            t._nesting++, t.onMicrotaskEmpty.emit(null)
          } finally {
            if ((t._nesting--, !t.hasPendingMicrotasks))
              try {
                t.runOutsideAngular(() => t.onStable.emit(null))
              } finally {
                t.isStable = !0
              }
          }
      }
      function yl (t) {
        t.hasPendingMicrotasks = !!(
          t._hasPendingMicrotasks ||
          (t.shouldCoalesceEventChangeDetection &&
            -1 !== t.lastRequestAnimationFrameId)
        )
      }
      function vl (t) {
        t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null))
      }
      function _l (t) {
        t._nesting--, ml(t)
      }
      class wl {
        constructor () {
          ;(this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new Aa()),
            (this.onMicrotaskEmpty = new Aa()),
            (this.onStable = new Aa()),
            (this.onError = new Aa())
        }
        run (t, e, n) {
          return t.apply(e, n)
        }
        runGuarded (t, e, n) {
          return t.apply(e, n)
        }
        runOutsideAngular (t) {
          return t()
        }
        runTask (t, e, n, r) {
          return t.apply(e, n)
        }
      }
      let bl = (() => {
          class t {
            constructor (t) {
              ;(this._ngZone = t),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                this._watchAngularEvents(),
                t.run(() => {
                  this.taskTrackingZone =
                    'undefined' == typeof Zone
                      ? null
                      : Zone.current.get('TaskTrackingZone')
                })
            }
            _watchAngularEvents () {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  ;(this._didWork = !0), (this._isZoneStable = !1)
                }
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      pl.assertNotInAngularZone(),
                        dl(() => {
                          ;(this._isZoneStable = !0),
                            this._runCallbacksIfReady()
                        })
                    }
                  })
                })
            }
            increasePendingRequestCount () {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              )
            }
            decreasePendingRequestCount () {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error('pending async requests below zero')
              return this._runCallbacksIfReady(), this._pendingCount
            }
            isStable () {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              )
            }
            _runCallbacksIfReady () {
              if (this.isStable())
                dl(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let t = this._callbacks.pop()
                    clearTimeout(t.timeoutId), t.doneCb(this._didWork)
                  }
                  this._didWork = !1
                })
              else {
                let t = this.getPendingTasks()
                ;(this._callbacks = this._callbacks.filter(
                  e =>
                    !e.updateCb ||
                    !e.updateCb(t) ||
                    (clearTimeout(e.timeoutId), !1)
                )),
                  (this._didWork = !0)
              }
            }
            getPendingTasks () {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map(t => ({
                    source: t.source,
                    creationLocation: t.creationLocation,
                    data: t.data
                  }))
                : []
            }
            addCallback (t, e, n) {
              let r = -1
              e &&
                e > 0 &&
                (r = setTimeout(() => {
                  ;(this._callbacks = this._callbacks.filter(
                    t => t.timeoutId !== r
                  )),
                    t(this._didWork, this.getPendingTasks())
                }, e)),
                this._callbacks.push({ doneCb: t, timeoutId: r, updateCb: n })
            }
            whenStable (t, e, n) {
              if (n && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/dist/task-tracking.js" loaded?'
                )
              this.addCallback(t, e, n), this._runCallbacksIfReady()
            }
            getPendingRequestCount () {
              return this._pendingCount
            }
            findProviders (t, e, n) {
              return []
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Wt(pl))
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })(),
        Cl = (() => {
          class t {
            constructor () {
              ;(this._applications = new Map()), El.addToWindow(this)
            }
            registerApplication (t, e) {
              this._applications.set(t, e)
            }
            unregisterApplication (t) {
              this._applications.delete(t)
            }
            unregisterAllApplications () {
              this._applications.clear()
            }
            getTestability (t) {
              return this._applications.get(t) || null
            }
            getAllTestabilities () {
              return Array.from(this._applications.values())
            }
            getAllRootElements () {
              return Array.from(this._applications.keys())
            }
            findTestabilityInTree (t, e = !0) {
              return El.findTestabilityInTree(this, t, e)
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)()
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })()
      class Sl {
        addToWindow (t) {}
        findTestabilityInTree (t, e, n) {
          return null
        }
      }
      let xl,
        El = new Sl(),
        Tl = function (t, e, n) {
          const r = new _a(n)
          if (0 === fi.size) return Promise.resolve(r)
          const s = (function (t) {
            const e = []
            return t.forEach(t => t && e.push(...t)), e
          })(
            t
              .get(cl, [])
              .concat(e)
              .map(t => t.providers)
          )
          if (0 === s.length) return Promise.resolve(r)
          const i = (function () {
              const t = Ot.ng
              if (!t || !t.ɵcompilerFacade)
                throw new Error(
                  "Angular JIT compilation failed: '@angular/compiler' not loaded!\n  - JIT compilation is discouraged for production use-cases! Consider AOT mode instead.\n  - Did you bootstrap using '@angular/platform-browser-dynamic' or '@angular/platform-server'?\n  - Alternatively provide the compiler with 'import \"@angular/compiler\";' before bootstrapping."
                )
              return t.ɵcompilerFacade
            })(),
            o = di.create({ providers: s }).get(i.ResourceLoader)
          return (function (t) {
            const e = [],
              n = new Map()
            function r (t) {
              let e = n.get(t)
              if (!e) {
                const r = (t => Promise.resolve(o.get(t)))(t)
                n.set(t, (e = r.then(mi)))
              }
              return e
            }
            return (
              fi.forEach((t, n) => {
                const s = []
                t.templateUrl &&
                  s.push(
                    r(t.templateUrl).then(e => {
                      t.template = e
                    })
                  )
                const i = t.styleUrls,
                  o = t.styles || (t.styles = []),
                  a = t.styles.length
                i &&
                  i.forEach((e, n) => {
                    o.push(''),
                      s.push(
                        r(e).then(r => {
                          ;(o[a + n] = r),
                            i.splice(i.indexOf(e), 1),
                            0 == i.length && (t.styleUrls = void 0)
                        })
                      )
                  })
                const l = Promise.all(s).then(() =>
                  (function (t) {
                    gi.delete(t)
                  })(n)
                )
                e.push(l)
              }),
              (fi = new Map()),
              Promise.all(e).then(() => {})
            )
          })().then(() => r)
        }
      const kl = new jt('AllowMultipleToken')
      class Al {
        constructor (t, e) {
          ;(this.name = t), (this.token = e)
        }
      }
      function Ol (t, e, n = []) {
        const r = `Platform: ${e}`,
          s = new jt(r)
        return (e = []) => {
          let i = Il()
          if (!i || i.injector.get(kl, !1))
            if (t) t(n.concat(e).concat({ provide: s, useValue: !0 }))
            else {
              const t = n
                .concat(e)
                .concat(
                  { provide: s, useValue: !0 },
                  { provide: Ys, useValue: 'platform' }
                )
              !(function (t) {
                if (xl && !xl.destroyed && !xl.injector.get(kl, !1))
                  throw new Error(
                    'There can be only one platform. Destroy the previous one to create a new one.'
                  )
                xl = t.get(Ml)
                const e = t.get(Qa, null)
                e && e.forEach(t => t())
              })(di.create({ providers: t, name: r }))
            }
          return (function (t) {
            const e = Il()
            if (!e) throw new Error('No platform exists!')
            if (!e.injector.get(t, null))
              throw new Error(
                'A platform with a different configuration has been created. Please destroy it first.'
              )
            return e
          })(s)
        }
      }
      function Il () {
        return xl && !xl.destroyed ? xl : null
      }
      let Ml = (() => {
        class t {
          constructor (t) {
            ;(this._injector = t),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1)
          }
          bootstrapModuleFactory (t, e) {
            const n = (function (t, e) {
                let n
                return (
                  (n =
                    'noop' === t
                      ? new wl()
                      : ('zone.js' === t ? void 0 : t) ||
                        new pl({
                          enableLongStackTrace: ar(),
                          shouldCoalesceEventChangeDetection: e
                        })),
                  n
                )
              })(e ? e.ngZone : void 0, (e && e.ngZoneEventCoalescing) || !1),
              r = [{ provide: pl, useValue: n }]
            return n.run(() => {
              const e = di.create({
                  providers: r,
                  parent: this.injector,
                  name: t.moduleType.name
                }),
                s = t.create(e),
                i = s.injector.get(nr, null)
              if (!i)
                throw new Error(
                  'No ErrorHandler. Is platform module (BrowserModule) included?'
                )
              return (
                s.onDestroy(() => Nl(this._modules, s)),
                n.runOutsideAngular(() =>
                  n.onError.subscribe({
                    next: t => {
                      i.handleError(t)
                    }
                  })
                ),
                (function (t, e, n) {
                  try {
                    const r = n()
                    return Li(r)
                      ? r.catch(n => {
                          throw (e.runOutsideAngular(() => t.handleError(n)), n)
                        })
                      : r
                  } catch (r) {
                    throw (e.runOutsideAngular(() => t.handleError(r)), r)
                  }
                })(i, n, () => {
                  const t = s.injector.get(qa)
                  return (
                    t.runInitializers(),
                    t.donePromise.then(
                      () => (
                        ma(s.injector.get(Xa, 'en-US') || 'en-US'),
                        this._moduleDoBootstrap(s),
                        s
                      )
                    )
                  )
                })
              )
            })
          }
          bootstrapModule (t, e = []) {
            const n = Pl({}, e)
            return Tl(this.injector, n, t).then(t =>
              this.bootstrapModuleFactory(t, n)
            )
          }
          _moduleDoBootstrap (t) {
            const e = t.injector.get(Rl)
            if (t._bootstrapComponents.length > 0)
              t._bootstrapComponents.forEach(t => e.bootstrap(t))
            else {
              if (!t.instance.ngDoBootstrap)
                throw new Error(
                  `The module ${_t(
                    t.instance.constructor
                  )} was bootstrapped, but it does not declare "@NgModule.bootstrap" components nor a "ngDoBootstrap" method. ` +
                    'Please define one of these.'
                )
              t.instance.ngDoBootstrap(e)
            }
            this._modules.push(t)
          }
          onDestroy (t) {
            this._destroyListeners.push(t)
          }
          get injector () {
            return this._injector
          }
          destroy () {
            if (this._destroyed)
              throw new Error('The platform has already been destroyed!')
            this._modules.slice().forEach(t => t.destroy()),
              this._destroyListeners.forEach(t => t()),
              (this._destroyed = !0)
          }
          get destroyed () {
            return this._destroyed
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Wt(di))
          }),
          (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
          t
        )
      })()
      function Pl (t, e) {
        return Array.isArray(e)
          ? e.reduce(Pl, t)
          : Object.assign(Object.assign({}, t), e)
      }
      let Rl = (() => {
        class t {
          constructor (t, e, n, r, s, i) {
            ;(this._zone = t),
              (this._console = e),
              (this._injector = n),
              (this._exceptionHandler = r),
              (this._componentFactoryResolver = s),
              (this._initStatus = i),
              (this._bootstrapListeners = []),
              (this._views = []),
              (this._runningTick = !1),
              (this._enforceNoNewChanges = !1),
              (this._stable = !0),
              (this.componentTypes = []),
              (this.components = []),
              (this._enforceNoNewChanges = ar()),
              this._zone.onMicrotaskEmpty.subscribe({
                next: () => {
                  this._zone.run(() => {
                    this.tick()
                  })
                }
              })
            const o = new w(t => {
                ;(this._stable =
                  this._zone.isStable &&
                  !this._zone.hasPendingMacrotasks &&
                  !this._zone.hasPendingMicrotasks),
                  this._zone.runOutsideAngular(() => {
                    t.next(this._stable), t.complete()
                  })
              }),
              a = new w(t => {
                let e
                this._zone.runOutsideAngular(() => {
                  e = this._zone.onStable.subscribe(() => {
                    pl.assertNotInAngularZone(),
                      dl(() => {
                        this._stable ||
                          this._zone.hasPendingMacrotasks ||
                          this._zone.hasPendingMicrotasks ||
                          ((this._stable = !0), t.next(!0))
                      })
                  })
                })
                const n = this._zone.onUnstable.subscribe(() => {
                  pl.assertInAngularZone(),
                    this._stable &&
                      ((this._stable = !1),
                      this._zone.runOutsideAngular(() => {
                        t.next(!1)
                      }))
                })
                return () => {
                  e.unsubscribe(), n.unsubscribe()
                }
              })
            this.isStable = (function (...t) {
              let e = Number.POSITIVE_INFINITY,
                n = null,
                r = t[t.length - 1]
              return (
                k(r)
                  ? ((n = t.pop()),
                    t.length > 1 &&
                      'number' == typeof t[t.length - 1] &&
                      (e = t.pop()))
                  : 'number' == typeof r && (e = t.pop()),
                null === n && 1 === t.length && t[0] instanceof w
                  ? t[0]
                  : q(e)(B(t, n))
              )
            })(
              o,
              a.pipe(t => {
                return W()(
                  ((e = X),
                  function (t) {
                    let n
                    n =
                      'function' == typeof e
                        ? e
                        : function () {
                            return e
                          }
                    const r = Object.create(t, K)
                    return (r.source = t), (r.subjectFactory = n), r
                  })(t)
                )
                var e
              })
            )
          }
          bootstrap (t, e) {
            if (!this._initStatus.done)
              throw new Error(
                'Cannot bootstrap as there are still asynchronous initializers running. Bootstrap components in the `ngDoBootstrap` method of the root module.'
              )
            let n
            ;(n =
              t instanceof To
                ? t
                : this._componentFactoryResolver.resolveComponentFactory(t)),
              this.componentTypes.push(n.componentType)
            const r = n.isBoundToModule ? void 0 : this._injector.get(Kt),
              s = n.create(di.NULL, [], e || n.selector, r)
            s.onDestroy(() => {
              this._unloadComponent(s)
            })
            const i = s.injector.get(bl, null)
            return (
              i &&
                s.injector
                  .get(Cl)
                  .registerApplication(s.location.nativeElement, i),
              this._loadComponent(s),
              ar() &&
                this._console.log(
                  'Angular is running in the development mode. Call enableProdMode() to enable the production mode.'
                ),
              s
            )
          }
          tick () {
            if (this._runningTick)
              throw new Error('ApplicationRef.tick is called recursively')
            try {
              this._runningTick = !0
              for (let t of this._views) t.detectChanges()
              if (this._enforceNoNewChanges)
                for (let t of this._views) t.checkNoChanges()
            } catch (t) {
              this._zone.runOutsideAngular(() =>
                this._exceptionHandler.handleError(t)
              )
            } finally {
              this._runningTick = !1
            }
          }
          attachView (t) {
            const e = t
            this._views.push(e), e.attachToAppRef(this)
          }
          detachView (t) {
            const e = t
            Nl(this._views, e), e.detachFromAppRef()
          }
          _loadComponent (t) {
            this.attachView(t.hostView),
              this.tick(),
              this.components.push(t),
              this._injector
                .get(Ka, [])
                .concat(this._bootstrapListeners)
                .forEach(e => e(t))
          }
          _unloadComponent (t) {
            this.detachView(t.hostView), Nl(this.components, t)
          }
          ngOnDestroy () {
            this._views.slice().forEach(t => t.destroy())
          }
          get viewCount () {
            return this._views.length
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Wt(pl), Wt(Ya), Wt(di), Wt(nr), Wt(Ao), Wt(qa))
          }),
          (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
          t
        )
      })()
      function Nl (t, e) {
        const n = t.indexOf(e)
        n > -1 && t.splice(n, 1)
      }
      class Dl {}
      class Vl {}
      const jl = { factoryPathPrefix: '', factoryPathSuffix: '.ngfactory' }
      let Fl = (() => {
        class t {
          constructor (t, e) {
            ;(this._compiler = t), (this._config = e || jl)
          }
          load (t) {
            return this.loadAndCompile(t)
          }
          loadAndCompile (t) {
            let [e, r] = t.split('#')
            return (
              void 0 === r && (r = 'default'),
              n('zn8P')(e)
                .then(t => t[r])
                .then(t => Ul(t, e, r))
                .then(t => this._compiler.compileModuleAsync(t))
            )
          }
          loadFactory (t) {
            let [e, r] = t.split('#'),
              s = 'NgFactory'
            return (
              void 0 === r && ((r = 'default'), (s = '')),
              n('zn8P')(
                this._config.factoryPathPrefix +
                  e +
                  this._config.factoryPathSuffix
              )
                .then(t => t[r + s])
                .then(t => Ul(t, e, r))
            )
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Wt(ul), Wt(Vl, 8))
          }),
          (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
          t
        )
      })()
      function Ul (t, e, n) {
        if (!t) throw new Error(`Cannot find '${n}' in '${e}'`)
        return t
      }
      const Ll = Ol(null, 'core', [
          { provide: Ja, useValue: 'unknown' },
          { provide: Ml, deps: [di] },
          { provide: Cl, deps: [] },
          { provide: Ya, deps: [] }
        ]),
        $l = [
          { provide: Rl, useClass: Rl, deps: [pl, Ya, di, nr, Ao, qa] },
          {
            provide: oa,
            deps: [pl],
            useFactory: function (t) {
              let e = []
              return (
                t.onStable.subscribe(() => {
                  for (; e.length; ) e.pop()()
                }),
                function (t) {
                  e.push(t)
                }
              )
            }
          },
          { provide: qa, useClass: qa, deps: [[new rt(), za]] },
          { provide: ul, useClass: ul, deps: [] },
          Wa,
          {
            provide: Zo,
            useFactory: function () {
              return Ko
            },
            deps: []
          },
          {
            provide: Qo,
            useFactory: function () {
              return Yo
            },
            deps: []
          },
          {
            provide: Xa,
            useFactory: function (t) {
              return (
                ma(
                  (t =
                    t ||
                    ('undefined' != typeof $localize && $localize.locale) ||
                    'en-US')
                ),
                t
              )
            },
            deps: [[new nt(Xa), new rt(), new it()]]
          },
          { provide: tl, useValue: 'USD' }
        ]
      let Hl = (() => {
        class t {
          constructor (t) {}
        }
        return (
          (t.ɵmod = fe({ type: t })),
          (t.ɵinj = ct({
            factory: function (e) {
              return new (e || t)(Wt(Rl))
            },
            providers: $l
          })),
          t
        )
      })()
      var Gl = (function (t) {
        return (
          (t[(t.Emulated = 0)] = 'Emulated'),
          (t[(t.Native = 1)] = 'Native'),
          (t[(t.None = 2)] = 'None'),
          (t[(t.ShadowDom = 3)] = 'ShadowDom'),
          t
        )
      })({})
      'undefined' != typeof window && window,
        'undefined' != typeof self &&
          'undefined' != typeof WorkerGlobalScope &&
          self instanceof WorkerGlobalScope &&
          self,
        'undefined' != typeof global && global
      class zl {
        get (t) {
          return ''
        }
      }
      class ql {
        constructor ({
          defaultEncapsulation: t = Gl.Emulated,
          useJit: e = !0,
          jitDevMode: n = !1,
          missingTranslation: r = null,
          preserveWhitespaces: s,
          strictInjectionParameters: i
        } = {}) {
          var o
          ;(this.defaultEncapsulation = t),
            (this.useJit = !!e),
            (this.jitDevMode = !!n),
            (this.missingTranslation = r),
            (this.preserveWhitespaces = (function (t, e = !1) {
              return null === t ? e : t
            })(void 0 === (o = s) ? null : o)),
            (this.strictInjectionParameters = !0 === i)
        }
      }
      let Bl = null
      function Wl () {
        return Bl
      }
      const Zl = new jt('DocumentToken')
      let Ql = (() => {
        class t {}
        return (
          (t.ɵfac = function (e) {
            return new (e || t)()
          }),
          (t.ɵprov = ut({ factory: Jl, token: t, providedIn: 'platform' })),
          t
        )
      })()
      function Jl () {
        return Wt(Yl)
      }
      const Kl = new jt('Location Initialized')
      let Yl = (() => {
        class t extends Ql {
          constructor (t) {
            super(), (this._doc = t), this._init()
          }
          _init () {
            ;(this.location = Wl().getLocation()),
              (this._history = Wl().getHistory())
          }
          getBaseHrefFromDOM () {
            return Wl().getBaseHref(this._doc)
          }
          onPopState (t) {
            Wl()
              .getGlobalEventTarget(this._doc, 'window')
              .addEventListener('popstate', t, !1)
          }
          onHashChange (t) {
            Wl()
              .getGlobalEventTarget(this._doc, 'window')
              .addEventListener('hashchange', t, !1)
          }
          get href () {
            return this.location.href
          }
          get protocol () {
            return this.location.protocol
          }
          get hostname () {
            return this.location.hostname
          }
          get port () {
            return this.location.port
          }
          get pathname () {
            return this.location.pathname
          }
          get search () {
            return this.location.search
          }
          get hash () {
            return this.location.hash
          }
          set pathname (t) {
            this.location.pathname = t
          }
          pushState (t, e, n) {
            Xl() ? this._history.pushState(t, e, n) : (this.location.hash = n)
          }
          replaceState (t, e, n) {
            Xl()
              ? this._history.replaceState(t, e, n)
              : (this.location.hash = n)
          }
          forward () {
            this._history.forward()
          }
          back () {
            this._history.back()
          }
          getState () {
            return this._history.state
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Wt(Zl))
          }),
          (t.ɵprov = ut({ factory: tu, token: t, providedIn: 'platform' })),
          t
        )
      })()
      function Xl () {
        return !!window.history.pushState
      }
      function tu () {
        return new Yl(Wt(Zl))
      }
      function eu (t, e) {
        if (0 == t.length) return e
        if (0 == e.length) return t
        let n = 0
        return (
          t.endsWith('/') && n++,
          e.startsWith('/') && n++,
          2 == n ? t + e.substring(1) : 1 == n ? t + e : t + '/' + e
        )
      }
      function nu (t) {
        const e = t.match(/#|\?|$/),
          n = (e && e.index) || t.length
        return t.slice(0, n - ('/' === t[n - 1] ? 1 : 0)) + t.slice(n)
      }
      function ru (t) {
        return t && '?' !== t[0] ? '?' + t : t
      }
      let su = (() => {
        class t {}
        return (
          (t.ɵfac = function (e) {
            return new (e || t)()
          }),
          (t.ɵprov = ut({ factory: iu, token: t, providedIn: 'root' })),
          t
        )
      })()
      function iu (t) {
        const e = Wt(Zl).location
        return new au(Wt(Ql), (e && e.origin) || '')
      }
      const ou = new jt('appBaseHref')
      let au = (() => {
          class t extends su {
            constructor (t, e) {
              if (
                (super(),
                (this._platformLocation = t),
                null == e && (e = this._platformLocation.getBaseHrefFromDOM()),
                null == e)
              )
                throw new Error(
                  'No base href set. Please provide a value for the APP_BASE_HREF token or add a base element to the document.'
                )
              this._baseHref = e
            }
            onPopState (t) {
              this._platformLocation.onPopState(t),
                this._platformLocation.onHashChange(t)
            }
            getBaseHref () {
              return this._baseHref
            }
            prepareExternalUrl (t) {
              return eu(this._baseHref, t)
            }
            path (t = !1) {
              const e =
                  this._platformLocation.pathname +
                  ru(this._platformLocation.search),
                n = this._platformLocation.hash
              return n && t ? `${e}${n}` : e
            }
            pushState (t, e, n, r) {
              const s = this.prepareExternalUrl(n + ru(r))
              this._platformLocation.pushState(t, e, s)
            }
            replaceState (t, e, n, r) {
              const s = this.prepareExternalUrl(n + ru(r))
              this._platformLocation.replaceState(t, e, s)
            }
            forward () {
              this._platformLocation.forward()
            }
            back () {
              this._platformLocation.back()
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Wt(Ql), Wt(ou, 8))
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })(),
        lu = (() => {
          class t extends su {
            constructor (t, e) {
              super(),
                (this._platformLocation = t),
                (this._baseHref = ''),
                null != e && (this._baseHref = e)
            }
            onPopState (t) {
              this._platformLocation.onPopState(t),
                this._platformLocation.onHashChange(t)
            }
            getBaseHref () {
              return this._baseHref
            }
            path (t = !1) {
              let e = this._platformLocation.hash
              return null == e && (e = '#'), e.length > 0 ? e.substring(1) : e
            }
            prepareExternalUrl (t) {
              const e = eu(this._baseHref, t)
              return e.length > 0 ? '#' + e : e
            }
            pushState (t, e, n, r) {
              let s = this.prepareExternalUrl(n + ru(r))
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.pushState(t, e, s)
            }
            replaceState (t, e, n, r) {
              let s = this.prepareExternalUrl(n + ru(r))
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.replaceState(t, e, s)
            }
            forward () {
              this._platformLocation.forward()
            }
            back () {
              this._platformLocation.back()
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Wt(Ql), Wt(ou, 8))
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })(),
        uu = (() => {
          class t {
            constructor (t, e) {
              ;(this._subject = new Aa()),
                (this._urlChangeListeners = []),
                (this._platformStrategy = t)
              const n = this._platformStrategy.getBaseHref()
              ;(this._platformLocation = e),
                (this._baseHref = nu(hu(n))),
                this._platformStrategy.onPopState(t => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: t.state,
                    type: t.type
                  })
                })
            }
            path (t = !1) {
              return this.normalize(this._platformStrategy.path(t))
            }
            getState () {
              return this._platformLocation.getState()
            }
            isCurrentPathEqualTo (t, e = '') {
              return this.path() == this.normalize(t + ru(e))
            }
            normalize (e) {
              return t.stripTrailingSlash(
                (function (t, e) {
                  return t && e.startsWith(t) ? e.substring(t.length) : e
                })(this._baseHref, hu(e))
              )
            }
            prepareExternalUrl (t) {
              return (
                t && '/' !== t[0] && (t = '/' + t),
                this._platformStrategy.prepareExternalUrl(t)
              )
            }
            go (t, e = '', n = null) {
              this._platformStrategy.pushState(n, '', t, e),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(t + ru(e)),
                  n
                )
            }
            replaceState (t, e = '', n = null) {
              this._platformStrategy.replaceState(n, '', t, e),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(t + ru(e)),
                  n
                )
            }
            forward () {
              this._platformStrategy.forward()
            }
            back () {
              this._platformStrategy.back()
            }
            onUrlChange (t) {
              this._urlChangeListeners.push(t),
                this.subscribe(t => {
                  this._notifyUrlChangeListeners(t.url, t.state)
                })
            }
            _notifyUrlChangeListeners (t = '', e) {
              this._urlChangeListeners.forEach(n => n(t, e))
            }
            subscribe (t, e, n) {
              return this._subject.subscribe({ next: t, error: e, complete: n })
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Wt(su), Wt(Ql))
            }),
            (t.normalizeQueryParams = ru),
            (t.joinWithSlash = eu),
            (t.stripTrailingSlash = nu),
            (t.ɵprov = ut({ factory: cu, token: t, providedIn: 'root' })),
            t
          )
        })()
      function cu () {
        return new uu(Wt(su), Wt(Ql))
      }
      function hu (t) {
        return t.replace(/\/index.html$/, '')
      }
      const du = (function () {
          var t = { Decimal: 0, Percent: 1, Currency: 2, Scientific: 3 }
          return (
            (t[t.Decimal] = 'Decimal'),
            (t[t.Percent] = 'Percent'),
            (t[t.Currency] = 'Currency'),
            (t[t.Scientific] = 'Scientific'),
            t
          )
        })(),
        pu = (function () {
          var t = { Zero: 0, One: 1, Two: 2, Few: 3, Many: 4, Other: 5 }
          return (
            (t[t.Zero] = 'Zero'),
            (t[t.One] = 'One'),
            (t[t.Two] = 'Two'),
            (t[t.Few] = 'Few'),
            (t[t.Many] = 'Many'),
            (t[t.Other] = 'Other'),
            t
          )
        })(),
        fu = (function () {
          var t = { Format: 0, Standalone: 1 }
          return (t[t.Format] = 'Format'), (t[t.Standalone] = 'Standalone'), t
        })(),
        gu = (function () {
          var t = { Narrow: 0, Abbreviated: 1, Wide: 2, Short: 3 }
          return (
            (t[t.Narrow] = 'Narrow'),
            (t[t.Abbreviated] = 'Abbreviated'),
            (t[t.Wide] = 'Wide'),
            (t[t.Short] = 'Short'),
            t
          )
        })(),
        mu = (function () {
          var t = { Short: 0, Medium: 1, Long: 2, Full: 3 }
          return (
            (t[t.Short] = 'Short'),
            (t[t.Medium] = 'Medium'),
            (t[t.Long] = 'Long'),
            (t[t.Full] = 'Full'),
            t
          )
        })(),
        yu = (function () {
          var t = {
            Decimal: 0,
            Group: 1,
            List: 2,
            PercentSign: 3,
            PlusSign: 4,
            MinusSign: 5,
            Exponential: 6,
            SuperscriptingExponent: 7,
            PerMille: 8,
            Infinity: 9,
            NaN: 10,
            TimeSeparator: 11,
            CurrencyDecimal: 12,
            CurrencyGroup: 13
          }
          return (
            (t[t.Decimal] = 'Decimal'),
            (t[t.Group] = 'Group'),
            (t[t.List] = 'List'),
            (t[t.PercentSign] = 'PercentSign'),
            (t[t.PlusSign] = 'PlusSign'),
            (t[t.MinusSign] = 'MinusSign'),
            (t[t.Exponential] = 'Exponential'),
            (t[t.SuperscriptingExponent] = 'SuperscriptingExponent'),
            (t[t.PerMille] = 'PerMille'),
            (t[t.Infinity] = 'Infinity'),
            (t[t.NaN] = 'NaN'),
            (t[t.TimeSeparator] = 'TimeSeparator'),
            (t[t.CurrencyDecimal] = 'CurrencyDecimal'),
            (t[t.CurrencyGroup] = 'CurrencyGroup'),
            t
          )
        })()
      function vu (t, e) {
        return Su(da(t)[fa.DateFormat], e)
      }
      function _u (t, e) {
        return Su(da(t)[fa.TimeFormat], e)
      }
      function wu (t, e) {
        return Su(da(t)[fa.DateTimeFormat], e)
      }
      function bu (t, e) {
        const n = da(t),
          r = n[fa.NumberSymbols][e]
        if (void 0 === r) {
          if (e === yu.CurrencyDecimal) return n[fa.NumberSymbols][yu.Decimal]
          if (e === yu.CurrencyGroup) return n[fa.NumberSymbols][yu.Group]
        }
        return r
      }
      function Cu (t) {
        if (!t[fa.ExtraData])
          throw new Error(
            `Missing extra locale data for the locale "${
              t[fa.LocaleId]
            }". Use "registerLocaleData" to load new data. See the "I18n guide" on angular.io to know more.`
          )
      }
      function Su (t, e) {
        for (let n = e; n > -1; n--) if (void 0 !== t[n]) return t[n]
        throw new Error('Locale data API: locale data undefined')
      }
      function xu (t) {
        const [e, n] = t.split(':')
        return { hours: +e, minutes: +n }
      }
      const Eu =
          /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/,
        Tu = {},
        ku =
          /((?:[^GyMLwWdEabBhHmsSzZO']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/,
        Au = (function () {
          var t = { Short: 0, ShortGMT: 1, Long: 2, Extended: 3 }
          return (
            (t[t.Short] = 'Short'),
            (t[t.ShortGMT] = 'ShortGMT'),
            (t[t.Long] = 'Long'),
            (t[t.Extended] = 'Extended'),
            t
          )
        })(),
        Ou = (function () {
          var t = {
            FullYear: 0,
            Month: 1,
            Date: 2,
            Hours: 3,
            Minutes: 4,
            Seconds: 5,
            FractionalSeconds: 6,
            Day: 7
          }
          return (
            (t[t.FullYear] = 'FullYear'),
            (t[t.Month] = 'Month'),
            (t[t.Date] = 'Date'),
            (t[t.Hours] = 'Hours'),
            (t[t.Minutes] = 'Minutes'),
            (t[t.Seconds] = 'Seconds'),
            (t[t.FractionalSeconds] = 'FractionalSeconds'),
            (t[t.Day] = 'Day'),
            t
          )
        })(),
        Iu = (function () {
          var t = { DayPeriods: 0, Days: 1, Months: 2, Eras: 3 }
          return (
            (t[t.DayPeriods] = 'DayPeriods'),
            (t[t.Days] = 'Days'),
            (t[t.Months] = 'Months'),
            (t[t.Eras] = 'Eras'),
            t
          )
        })()
      function Mu (t, e) {
        return (
          e &&
            (t = t.replace(/\{([^}]+)}/g, function (t, n) {
              return null != e && n in e ? e[n] : t
            })),
          t
        )
      }
      function Pu (t, e, n = '-', r, s) {
        let i = ''
        ;(t < 0 || (s && t <= 0)) && (s ? (t = 1 - t) : ((t = -t), (i = n)))
        let o = String(t)
        for (; o.length < e; ) o = '0' + o
        return r && (o = o.substr(o.length - e)), i + o
      }
      function Ru (t, e, n = 0, r = !1, s = !1) {
        return function (i, o) {
          let a = (function (t, e) {
            switch (t) {
              case Ou.FullYear:
                return e.getFullYear()
              case Ou.Month:
                return e.getMonth()
              case Ou.Date:
                return e.getDate()
              case Ou.Hours:
                return e.getHours()
              case Ou.Minutes:
                return e.getMinutes()
              case Ou.Seconds:
                return e.getSeconds()
              case Ou.FractionalSeconds:
                return e.getMilliseconds()
              case Ou.Day:
                return e.getDay()
              default:
                throw new Error(`Unknown DateType value "${t}".`)
            }
          })(t, i)
          if (((n > 0 || a > -n) && (a += n), t === Ou.Hours))
            0 === a && -12 === n && (a = 12)
          else if (t === Ou.FractionalSeconds)
            return (l = e), Pu(a, 3).substr(0, l)
          var l
          const u = bu(o, yu.MinusSign)
          return Pu(a, e, u, r, s)
        }
      }
      function Nu (t, e, n = fu.Format, r = !1) {
        return function (s, i) {
          return (function (t, e, n, r, s, i) {
            switch (n) {
              case Iu.Months:
                return (function (t, e, n) {
                  const r = da(t),
                    s = Su([r[fa.MonthsFormat], r[fa.MonthsStandalone]], e)
                  return Su(s, n)
                })(e, s, r)[t.getMonth()]
              case Iu.Days:
                return (function (t, e, n) {
                  const r = da(t),
                    s = Su([r[fa.DaysFormat], r[fa.DaysStandalone]], e)
                  return Su(s, n)
                })(e, s, r)[t.getDay()]
              case Iu.DayPeriods:
                const o = t.getHours(),
                  a = t.getMinutes()
                if (i) {
                  const t = (function (t) {
                      const e = da(t)
                      return (
                        Cu(e),
                        (e[fa.ExtraData][2] || []).map(t =>
                          'string' == typeof t ? xu(t) : [xu(t[0]), xu(t[1])]
                        )
                      )
                    })(e),
                    n = (function (t, e, n) {
                      const r = da(t)
                      Cu(r)
                      const s =
                        Su([r[fa.ExtraData][0], r[fa.ExtraData][1]], e) || []
                      return Su(s, n) || []
                    })(e, s, r)
                  let i
                  if (
                    (t.forEach((t, e) => {
                      if (Array.isArray(t)) {
                        const { hours: r, minutes: s } = t[0],
                          { hours: l, minutes: u } = t[1]
                        o >= r &&
                          a >= s &&
                          (o < l || (o === l && a < u)) &&
                          (i = n[e])
                      } else {
                        const { hours: r, minutes: s } = t
                        r === o && s === a && (i = n[e])
                      }
                    }),
                    i)
                  )
                    return i
                }
                return (function (t, e, n) {
                  const r = da(t),
                    s = Su(
                      [r[fa.DayPeriodsFormat], r[fa.DayPeriodsStandalone]],
                      e
                    )
                  return Su(s, n)
                })(e, s, r)[o < 12 ? 0 : 1]
              case Iu.Eras:
                return (function (t, e) {
                  return Su(da(t)[fa.Eras], e)
                })(e, r)[t.getFullYear() <= 0 ? 0 : 1]
              default:
                throw new Error(`unexpected translation type ${n}`)
            }
          })(s, i, t, e, n, r)
        }
      }
      function Du (t) {
        return function (e, n, r) {
          const s = -1 * r,
            i = bu(n, yu.MinusSign),
            o = s > 0 ? Math.floor(s / 60) : Math.ceil(s / 60)
          switch (t) {
            case Au.Short:
              return (
                (s >= 0 ? '+' : '') + Pu(o, 2, i) + Pu(Math.abs(s % 60), 2, i)
              )
            case Au.ShortGMT:
              return 'GMT' + (s >= 0 ? '+' : '') + Pu(o, 1, i)
            case Au.Long:
              return (
                'GMT' +
                (s >= 0 ? '+' : '') +
                Pu(o, 2, i) +
                ':' +
                Pu(Math.abs(s % 60), 2, i)
              )
            case Au.Extended:
              return 0 === r
                ? 'Z'
                : (s >= 0 ? '+' : '') +
                    Pu(o, 2, i) +
                    ':' +
                    Pu(Math.abs(s % 60), 2, i)
            default:
              throw new Error(`Unknown zone width "${t}"`)
          }
        }
      }
      function Vu (t, e = !1) {
        return function (n, r) {
          let s
          if (e) {
            const t = new Date(n.getFullYear(), n.getMonth(), 1).getDay() - 1,
              e = n.getDate()
            s = 1 + Math.floor((e + t) / 7)
          } else {
            const t = (function (t) {
                const e = new Date(t, 0, 1).getDay()
                return new Date(t, 0, 1 + (e <= 4 ? 4 : 11) - e)
              })(n.getFullYear()),
              e =
                ((i = n),
                new Date(
                  i.getFullYear(),
                  i.getMonth(),
                  i.getDate() + (4 - i.getDay())
                )).getTime() - t.getTime()
            s = 1 + Math.round(e / 6048e5)
          }
          var i
          return Pu(s, t, bu(r, yu.MinusSign))
        }
      }
      const ju = {}
      function Fu (t, e) {
        t = t.replace(/:/g, '')
        const n = Date.parse('Jan 01, 1970 00:00:00 ' + t) / 6e4
        return isNaN(n) ? e : n
      }
      function Uu (t) {
        return t instanceof Date && !isNaN(t.valueOf())
      }
      const Lu = /^(\d+)?\.((\d+)(-(\d+))?)?$/
      function $u (t) {
        const e = parseInt(t)
        if (isNaN(e))
          throw new Error('Invalid integer literal when parsing ' + t)
        return e
      }
      class Hu {}
      let Gu = (() => {
        class t extends Hu {
          constructor (t) {
            super(), (this.locale = t)
          }
          getPluralCategory (t, e) {
            switch (
              (function (t) {
                return da(t)[fa.PluralCase]
              })(e || this.locale)(t)
            ) {
              case pu.Zero:
                return 'zero'
              case pu.One:
                return 'one'
              case pu.Two:
                return 'two'
              case pu.Few:
                return 'few'
              case pu.Many:
                return 'many'
              default:
                return 'other'
            }
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Wt(Xa))
          }),
          (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
          t
        )
      })()
      function zu (t, e) {
        e = encodeURIComponent(e)
        for (const n of t.split(';')) {
          const t = n.indexOf('='),
            [r, s] = -1 == t ? [n, ''] : [n.slice(0, t), n.slice(t + 1)]
          if (r.trim() === e) return decodeURIComponent(s)
        }
        return null
      }
      let qu = (() => {
        class t {
          constructor (t, e, n, r) {
            ;(this._iterableDiffers = t),
              (this._keyValueDiffers = e),
              (this._ngEl = n),
              (this._renderer = r),
              (this._iterableDiffer = null),
              (this._keyValueDiffer = null),
              (this._initialClasses = []),
              (this._rawClass = null)
          }
          set klass (t) {
            this._removeClasses(this._initialClasses),
              (this._initialClasses =
                'string' == typeof t ? t.split(/\s+/) : []),
              this._applyClasses(this._initialClasses),
              this._applyClasses(this._rawClass)
          }
          set ngClass (t) {
            this._removeClasses(this._rawClass),
              this._applyClasses(this._initialClasses),
              (this._iterableDiffer = null),
              (this._keyValueDiffer = null),
              (this._rawClass = 'string' == typeof t ? t.split(/\s+/) : t),
              this._rawClass &&
                (Ci(this._rawClass)
                  ? (this._iterableDiffer = this._iterableDiffers
                      .find(this._rawClass)
                      .create())
                  : (this._keyValueDiffer = this._keyValueDiffers
                      .find(this._rawClass)
                      .create()))
          }
          ngDoCheck () {
            if (this._iterableDiffer) {
              const t = this._iterableDiffer.diff(this._rawClass)
              t && this._applyIterableChanges(t)
            } else if (this._keyValueDiffer) {
              const t = this._keyValueDiffer.diff(this._rawClass)
              t && this._applyKeyValueChanges(t)
            }
          }
          _applyKeyValueChanges (t) {
            t.forEachAddedItem(t => this._toggleClass(t.key, t.currentValue)),
              t.forEachChangedItem(t =>
                this._toggleClass(t.key, t.currentValue)
              ),
              t.forEachRemovedItem(t => {
                t.previousValue && this._toggleClass(t.key, !1)
              })
          }
          _applyIterableChanges (t) {
            t.forEachAddedItem(t => {
              if ('string' != typeof t.item)
                throw new Error(
                  `NgClass can only toggle CSS classes expressed as strings, got ${_t(
                    t.item
                  )}`
                )
              this._toggleClass(t.item, !0)
            }),
              t.forEachRemovedItem(t => this._toggleClass(t.item, !1))
          }
          _applyClasses (t) {
            t &&
              (Array.isArray(t) || t instanceof Set
                ? t.forEach(t => this._toggleClass(t, !0))
                : Object.keys(t).forEach(e => this._toggleClass(e, !!t[e])))
          }
          _removeClasses (t) {
            t &&
              (Array.isArray(t) || t instanceof Set
                ? t.forEach(t => this._toggleClass(t, !1))
                : Object.keys(t).forEach(t => this._toggleClass(t, !1)))
          }
          _toggleClass (t, e) {
            ;(t = t.trim()) &&
              t.split(/\s+/g).forEach(t => {
                e
                  ? this._renderer.addClass(this._ngEl.nativeElement, t)
                  : this._renderer.removeClass(this._ngEl.nativeElement, t)
              })
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Pi(Zo), Pi(Qo), Pi(Oo), Pi(Ro))
          }),
          (t.ɵdir = me({
            type: t,
            selectors: [['', 'ngClass', '']],
            inputs: { klass: ['class', 'klass'], ngClass: 'ngClass' }
          })),
          t
        )
      })()
      class Bu {
        constructor (t, e, n, r) {
          ;(this.$implicit = t),
            (this.ngForOf = e),
            (this.index = n),
            (this.count = r)
        }
        get first () {
          return 0 === this.index
        }
        get last () {
          return this.index === this.count - 1
        }
        get even () {
          return this.index % 2 == 0
        }
        get odd () {
          return !this.even
        }
      }
      let Wu = (() => {
        class t {
          constructor (t, e, n) {
            ;(this._viewContainer = t),
              (this._template = e),
              (this._differs = n),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null)
          }
          set ngForOf (t) {
            ;(this._ngForOf = t), (this._ngForOfDirty = !0)
          }
          set ngForTrackBy (t) {
            ar() &&
              null != t &&
              'function' != typeof t &&
              console &&
              console.warn &&
              console.warn(
                `trackBy must be a function, but received ${JSON.stringify(
                  t
                )}. ` +
                  'See https://angular.io/api/common/NgForOf#change-propagation for more information.'
              ),
              (this._trackByFn = t)
          }
          get ngForTrackBy () {
            return this._trackByFn
          }
          set ngForTemplate (t) {
            t && (this._template = t)
          }
          ngDoCheck () {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1
              const n = this._ngForOf
              if (!this._differ && n)
                try {
                  this._differ = this._differs.find(n).create(this.ngForTrackBy)
                } catch (e) {
                  throw new Error(
                    `Cannot find a differ supporting object '${n}' of type '${
                      ((t = n), t.name || typeof t)
                    }'. NgFor only supports binding to Iterables such as Arrays.`
                  )
                }
            }
            var t
            if (this._differ) {
              const t = this._differ.diff(this._ngForOf)
              t && this._applyChanges(t)
            }
          }
          _applyChanges (t) {
            const e = []
            t.forEachOperation((t, n, r) => {
              if (null == t.previousIndex) {
                const n = this._viewContainer.createEmbeddedView(
                    this._template,
                    new Bu(null, this._ngForOf, -1, -1),
                    null === r ? void 0 : r
                  ),
                  s = new Zu(t, n)
                e.push(s)
              } else if (null == r)
                this._viewContainer.remove(null === n ? void 0 : n)
              else if (null !== n) {
                const s = this._viewContainer.get(n)
                this._viewContainer.move(s, r)
                const i = new Zu(t, s)
                e.push(i)
              }
            })
            for (let n = 0; n < e.length; n++)
              this._perViewChange(e[n].view, e[n].record)
            for (let n = 0, r = this._viewContainer.length; n < r; n++) {
              const t = this._viewContainer.get(n)
              ;(t.context.index = n),
                (t.context.count = r),
                (t.context.ngForOf = this._ngForOf)
            }
            t.forEachIdentityChange(t => {
              this._viewContainer.get(t.currentIndex).context.$implicit = t.item
            })
          }
          _perViewChange (t, e) {
            t.context.$implicit = e.item
          }
          static ngTemplateContextGuard (t, e) {
            return !0
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Pi(ea), Pi(Xo), Pi(Zo))
          }),
          (t.ɵdir = me({
            type: t,
            selectors: [['', 'ngFor', '', 'ngForOf', '']],
            inputs: {
              ngForOf: 'ngForOf',
              ngForTrackBy: 'ngForTrackBy',
              ngForTemplate: 'ngForTemplate'
            }
          })),
          t
        )
      })()
      class Zu {
        constructor (t, e) {
          ;(this.record = t), (this.view = e)
        }
      }
      let Qu = (() => {
        class t {
          constructor (t, e) {
            ;(this._viewContainer = t),
              (this._context = new Ju()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = e)
          }
          set ngIf (t) {
            ;(this._context.$implicit = this._context.ngIf = t),
              this._updateView()
          }
          set ngIfThen (t) {
            Ku('ngIfThen', t),
              (this._thenTemplateRef = t),
              (this._thenViewRef = null),
              this._updateView()
          }
          set ngIfElse (t) {
            Ku('ngIfElse', t),
              (this._elseTemplateRef = t),
              (this._elseViewRef = null),
              this._updateView()
          }
          _updateView () {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(),
                (this._elseViewRef = null),
                this._thenTemplateRef &&
                  (this._thenViewRef = this._viewContainer.createEmbeddedView(
                    this._thenTemplateRef,
                    this._context
                  )))
              : this._elseViewRef ||
                (this._viewContainer.clear(),
                (this._thenViewRef = null),
                this._elseTemplateRef &&
                  (this._elseViewRef = this._viewContainer.createEmbeddedView(
                    this._elseTemplateRef,
                    this._context
                  )))
          }
          static ngTemplateContextGuard (t, e) {
            return !0
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Pi(ea), Pi(Xo))
          }),
          (t.ɵdir = me({
            type: t,
            selectors: [['', 'ngIf', '']],
            inputs: { ngIf: 'ngIf', ngIfThen: 'ngIfThen', ngIfElse: 'ngIfElse' }
          })),
          t
        )
      })()
      class Ju {
        constructor () {
          ;(this.$implicit = null), (this.ngIf = null)
        }
      }
      function Ku (t, e) {
        if (e && !e.createEmbeddedView)
          throw new Error(
            `${t} must be a TemplateRef, but received '${_t(e)}'.`
          )
      }
      let Yu = (() => {
        class t {
          constructor (t) {
            ;(this._viewContainerRef = t),
              (this._viewRef = null),
              (this.ngTemplateOutletContext = null),
              (this.ngTemplateOutlet = null)
          }
          ngOnChanges (t) {
            if (this._shouldRecreateView(t)) {
              const t = this._viewContainerRef
              this._viewRef && t.remove(t.indexOf(this._viewRef)),
                (this._viewRef = this.ngTemplateOutlet
                  ? t.createEmbeddedView(
                      this.ngTemplateOutlet,
                      this.ngTemplateOutletContext
                    )
                  : null)
            } else
              this._viewRef &&
                this.ngTemplateOutletContext &&
                this._updateExistingContext(this.ngTemplateOutletContext)
          }
          _shouldRecreateView (t) {
            const e = t.ngTemplateOutletContext
            return (
              !!t.ngTemplateOutlet || (e && this._hasContextShapeChanged(e))
            )
          }
          _hasContextShapeChanged (t) {
            const e = Object.keys(t.previousValue || {}),
              n = Object.keys(t.currentValue || {})
            if (e.length === n.length) {
              for (let t of n) if (-1 === e.indexOf(t)) return !0
              return !1
            }
            return !0
          }
          _updateExistingContext (t) {
            for (let e of Object.keys(t))
              this._viewRef.context[e] = this.ngTemplateOutletContext[e]
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Pi(ea))
          }),
          (t.ɵdir = me({
            type: t,
            selectors: [['', 'ngTemplateOutlet', '']],
            inputs: {
              ngTemplateOutletContext: 'ngTemplateOutletContext',
              ngTemplateOutlet: 'ngTemplateOutlet'
            },
            features: [go]
          })),
          t
        )
      })()
      function Xu (t, e) {
        return Error(`InvalidPipeArgument: '${e}' for pipe '${_t(t)}'`)
      }
      let tc = (() => {
          class t {
            constructor (t) {
              this.locale = t
            }
            transform (e, n = 'mediumDate', r, s) {
              if (null == e || '' === e || e != e) return null
              try {
                return (function (t, e, n, r) {
                  let s = (function (t) {
                    if (Uu(t)) return t
                    if ('number' == typeof t && !isNaN(t)) return new Date(t)
                    if ('string' == typeof t) {
                      t = t.trim()
                      const e = parseFloat(t)
                      if (!isNaN(t - e)) return new Date(e)
                      if (/^(\d{4}-\d{1,2}-\d{1,2})$/.test(t)) {
                        const [e, n, r] = t.split('-').map(t => +t)
                        return new Date(e, n - 1, r)
                      }
                      let n
                      if ((n = t.match(Eu)))
                        return (function (t) {
                          const e = new Date(0)
                          let n = 0,
                            r = 0
                          const s = t[8] ? e.setUTCFullYear : e.setFullYear,
                            i = t[8] ? e.setUTCHours : e.setHours
                          t[9] &&
                            ((n = Number(t[9] + t[10])),
                            (r = Number(t[9] + t[11]))),
                            s.call(
                              e,
                              Number(t[1]),
                              Number(t[2]) - 1,
                              Number(t[3])
                            )
                          const o = Number(t[4] || 0) - n,
                            a = Number(t[5] || 0) - r,
                            l = Number(t[6] || 0),
                            u = Math.round(1e3 * parseFloat('0.' + (t[7] || 0)))
                          return i.call(e, o, a, l, u), e
                        })(n)
                    }
                    const e = new Date(t)
                    if (!Uu(e))
                      throw new Error(`Unable to convert "${t}" into a date`)
                    return e
                  })(t)
                  e =
                    (function t (e, n) {
                      const r = (function (t) {
                        return da(t)[fa.LocaleId]
                      })(e)
                      if (((Tu[r] = Tu[r] || {}), Tu[r][n])) return Tu[r][n]
                      let s = ''
                      switch (n) {
                        case 'shortDate':
                          s = vu(e, mu.Short)
                          break
                        case 'mediumDate':
                          s = vu(e, mu.Medium)
                          break
                        case 'longDate':
                          s = vu(e, mu.Long)
                          break
                        case 'fullDate':
                          s = vu(e, mu.Full)
                          break
                        case 'shortTime':
                          s = _u(e, mu.Short)
                          break
                        case 'mediumTime':
                          s = _u(e, mu.Medium)
                          break
                        case 'longTime':
                          s = _u(e, mu.Long)
                          break
                        case 'fullTime':
                          s = _u(e, mu.Full)
                          break
                        case 'short':
                          const n = t(e, 'shortTime'),
                            r = t(e, 'shortDate')
                          s = Mu(wu(e, mu.Short), [n, r])
                          break
                        case 'medium':
                          const i = t(e, 'mediumTime'),
                            o = t(e, 'mediumDate')
                          s = Mu(wu(e, mu.Medium), [i, o])
                          break
                        case 'long':
                          const a = t(e, 'longTime'),
                            l = t(e, 'longDate')
                          s = Mu(wu(e, mu.Long), [a, l])
                          break
                        case 'full':
                          const u = t(e, 'fullTime'),
                            c = t(e, 'fullDate')
                          s = Mu(wu(e, mu.Full), [u, c])
                      }
                      return s && (Tu[r][n] = s), s
                    })(n, e) || e
                  let i,
                    o = []
                  for (; e; ) {
                    if (((i = ku.exec(e)), !i)) {
                      o.push(e)
                      break
                    }
                    {
                      o = o.concat(i.slice(1))
                      const t = o.pop()
                      if (!t) break
                      e = t
                    }
                  }
                  let a = s.getTimezoneOffset()
                  r &&
                    ((a = Fu(r, a)),
                    (s = (function (t, e, n) {
                      const r = t.getTimezoneOffset()
                      return (function (t, e) {
                        return (
                          (t = new Date(t.getTime())).setMinutes(
                            t.getMinutes() + e
                          ),
                          t
                        )
                      })(t, -1 * (Fu(e, r) - r))
                    })(s, r)))
                  let l = ''
                  return (
                    o.forEach(t => {
                      const e = (function (t) {
                        if (ju[t]) return ju[t]
                        let e
                        switch (t) {
                          case 'G':
                          case 'GG':
                          case 'GGG':
                            e = Nu(Iu.Eras, gu.Abbreviated)
                            break
                          case 'GGGG':
                            e = Nu(Iu.Eras, gu.Wide)
                            break
                          case 'GGGGG':
                            e = Nu(Iu.Eras, gu.Narrow)
                            break
                          case 'y':
                            e = Ru(Ou.FullYear, 1, 0, !1, !0)
                            break
                          case 'yy':
                            e = Ru(Ou.FullYear, 2, 0, !0, !0)
                            break
                          case 'yyy':
                            e = Ru(Ou.FullYear, 3, 0, !1, !0)
                            break
                          case 'yyyy':
                            e = Ru(Ou.FullYear, 4, 0, !1, !0)
                            break
                          case 'M':
                          case 'L':
                            e = Ru(Ou.Month, 1, 1)
                            break
                          case 'MM':
                          case 'LL':
                            e = Ru(Ou.Month, 2, 1)
                            break
                          case 'MMM':
                            e = Nu(Iu.Months, gu.Abbreviated)
                            break
                          case 'MMMM':
                            e = Nu(Iu.Months, gu.Wide)
                            break
                          case 'MMMMM':
                            e = Nu(Iu.Months, gu.Narrow)
                            break
                          case 'LLL':
                            e = Nu(Iu.Months, gu.Abbreviated, fu.Standalone)
                            break
                          case 'LLLL':
                            e = Nu(Iu.Months, gu.Wide, fu.Standalone)
                            break
                          case 'LLLLL':
                            e = Nu(Iu.Months, gu.Narrow, fu.Standalone)
                            break
                          case 'w':
                            e = Vu(1)
                            break
                          case 'ww':
                            e = Vu(2)
                            break
                          case 'W':
                            e = Vu(1, !0)
                            break
                          case 'd':
                            e = Ru(Ou.Date, 1)
                            break
                          case 'dd':
                            e = Ru(Ou.Date, 2)
                            break
                          case 'E':
                          case 'EE':
                          case 'EEE':
                            e = Nu(Iu.Days, gu.Abbreviated)
                            break
                          case 'EEEE':
                            e = Nu(Iu.Days, gu.Wide)
                            break
                          case 'EEEEE':
                            e = Nu(Iu.Days, gu.Narrow)
                            break
                          case 'EEEEEE':
                            e = Nu(Iu.Days, gu.Short)
                            break
                          case 'a':
                          case 'aa':
                          case 'aaa':
                            e = Nu(Iu.DayPeriods, gu.Abbreviated)
                            break
                          case 'aaaa':
                            e = Nu(Iu.DayPeriods, gu.Wide)
                            break
                          case 'aaaaa':
                            e = Nu(Iu.DayPeriods, gu.Narrow)
                            break
                          case 'b':
                          case 'bb':
                          case 'bbb':
                            e = Nu(
                              Iu.DayPeriods,
                              gu.Abbreviated,
                              fu.Standalone,
                              !0
                            )
                            break
                          case 'bbbb':
                            e = Nu(Iu.DayPeriods, gu.Wide, fu.Standalone, !0)
                            break
                          case 'bbbbb':
                            e = Nu(Iu.DayPeriods, gu.Narrow, fu.Standalone, !0)
                            break
                          case 'B':
                          case 'BB':
                          case 'BBB':
                            e = Nu(Iu.DayPeriods, gu.Abbreviated, fu.Format, !0)
                            break
                          case 'BBBB':
                            e = Nu(Iu.DayPeriods, gu.Wide, fu.Format, !0)
                            break
                          case 'BBBBB':
                            e = Nu(Iu.DayPeriods, gu.Narrow, fu.Format, !0)
                            break
                          case 'h':
                            e = Ru(Ou.Hours, 1, -12)
                            break
                          case 'hh':
                            e = Ru(Ou.Hours, 2, -12)
                            break
                          case 'H':
                            e = Ru(Ou.Hours, 1)
                            break
                          case 'HH':
                            e = Ru(Ou.Hours, 2)
                            break
                          case 'm':
                            e = Ru(Ou.Minutes, 1)
                            break
                          case 'mm':
                            e = Ru(Ou.Minutes, 2)
                            break
                          case 's':
                            e = Ru(Ou.Seconds, 1)
                            break
                          case 'ss':
                            e = Ru(Ou.Seconds, 2)
                            break
                          case 'S':
                            e = Ru(Ou.FractionalSeconds, 1)
                            break
                          case 'SS':
                            e = Ru(Ou.FractionalSeconds, 2)
                            break
                          case 'SSS':
                            e = Ru(Ou.FractionalSeconds, 3)
                            break
                          case 'Z':
                          case 'ZZ':
                          case 'ZZZ':
                            e = Du(Au.Short)
                            break
                          case 'ZZZZZ':
                            e = Du(Au.Extended)
                            break
                          case 'O':
                          case 'OO':
                          case 'OOO':
                          case 'z':
                          case 'zz':
                          case 'zzz':
                            e = Du(Au.ShortGMT)
                            break
                          case 'OOOO':
                          case 'ZZZZ':
                          case 'zzzz':
                            e = Du(Au.Long)
                            break
                          default:
                            return null
                        }
                        return (ju[t] = e), e
                      })(t)
                      l += e
                        ? e(s, n, a)
                        : "''" === t
                        ? "'"
                        : t.replace(/(^'|'$)/g, '').replace(/''/g, "'")
                    }),
                    l
                  )
                })(e, n, s || this.locale, r)
              } catch (i) {
                throw Xu(t, i.message)
              }
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Pi(Xa))
            }),
            (t.ɵpipe = ye({ name: 'date', type: t, pure: !0 })),
            t
          )
        })(),
        ec = (() => {
          class t {
            constructor (t) {
              this._locale = t
            }
            transform (e, n, r) {
              if (
                (function (t) {
                  return null == t || '' === t || t != t
                })(e)
              )
                return null
              r = r || this._locale
              try {
                return (function (t, e, n) {
                  return (function (t, e, n, r, s, i, o = !1) {
                    let a = '',
                      l = !1
                    if (isFinite(t)) {
                      let u = (function (t) {
                        let e,
                          n,
                          r,
                          s,
                          i,
                          o = Math.abs(t) + '',
                          a = 0
                        for (
                          (n = o.indexOf('.')) > -1 && (o = o.replace('.', '')),
                            (r = o.search(/e/i)) > 0
                              ? (n < 0 && (n = r),
                                (n += +o.slice(r + 1)),
                                (o = o.substring(0, r)))
                              : n < 0 && (n = o.length),
                            r = 0;
                          '0' === o.charAt(r);
                          r++
                        );
                        if (r === (i = o.length)) (e = [0]), (n = 1)
                        else {
                          for (i--; '0' === o.charAt(i); ) i--
                          for (n -= r, e = [], s = 0; r <= i; r++, s++)
                            e[s] = Number(o.charAt(r))
                        }
                        return (
                          n > 22 &&
                            ((e = e.splice(0, 21)), (a = n - 1), (n = 1)),
                          { digits: e, exponent: a, integerLen: n }
                        )
                      })(t)
                      o &&
                        (u = (function (t) {
                          if (0 === t.digits[0]) return t
                          const e = t.digits.length - t.integerLen
                          return (
                            t.exponent
                              ? (t.exponent += 2)
                              : (0 === e
                                  ? t.digits.push(0, 0)
                                  : 1 === e && t.digits.push(0),
                                (t.integerLen += 2)),
                            t
                          )
                        })(u))
                      let c = e.minInt,
                        h = e.minFrac,
                        d = e.maxFrac
                      if (i) {
                        const t = i.match(Lu)
                        if (null === t)
                          throw new Error(`${i} is not a valid digit info`)
                        const e = t[1],
                          n = t[3],
                          r = t[5]
                        null != e && (c = $u(e)),
                          null != n && (h = $u(n)),
                          null != r
                            ? (d = $u(r))
                            : null != n && h > d && (d = h)
                      }
                      !(function (t, e, n) {
                        if (e > n)
                          throw new Error(
                            `The minimum number of digits after fraction (${e}) is higher than the maximum (${n}).`
                          )
                        let r = t.digits,
                          s = r.length - t.integerLen
                        const i = Math.min(Math.max(e, s), n)
                        let o = i + t.integerLen,
                          a = r[o]
                        if (o > 0) {
                          r.splice(Math.max(t.integerLen, o))
                          for (let t = o; t < r.length; t++) r[t] = 0
                        } else {
                          ;(s = Math.max(0, s)),
                            (t.integerLen = 1),
                            (r.length = Math.max(1, (o = i + 1))),
                            (r[0] = 0)
                          for (let t = 1; t < o; t++) r[t] = 0
                        }
                        if (a >= 5)
                          if (o - 1 < 0) {
                            for (let e = 0; e > o; e--)
                              r.unshift(0), t.integerLen++
                            r.unshift(1), t.integerLen++
                          } else r[o - 1]++
                        for (; s < Math.max(0, i); s++) r.push(0)
                        let l = 0 !== i
                        const u = e + t.integerLen,
                          c = r.reduceRight(function (t, e, n, r) {
                            return (
                              (r[n] = (e += t) < 10 ? e : e - 10),
                              l && (0 === r[n] && n >= u ? r.pop() : (l = !1)),
                              e >= 10 ? 1 : 0
                            )
                          }, 0)
                        c && (r.unshift(c), t.integerLen++)
                      })(u, h, d)
                      let p = u.digits,
                        f = u.integerLen
                      const g = u.exponent
                      let m = []
                      for (l = p.every(t => !t); f < c; f++) p.unshift(0)
                      for (; f < 0; f++) p.unshift(0)
                      f > 0 ? (m = p.splice(f, p.length)) : ((m = p), (p = [0]))
                      const y = []
                      for (
                        p.length >= e.lgSize &&
                        y.unshift(p.splice(-e.lgSize, p.length).join(''));
                        p.length > e.gSize;

                      )
                        y.unshift(p.splice(-e.gSize, p.length).join(''))
                      p.length && y.unshift(p.join('')),
                        (a = y.join(bu(n, r))),
                        m.length && (a += bu(n, s) + m.join('')),
                        g && (a += bu(n, yu.Exponential) + '+' + g)
                    } else a = bu(n, yu.Infinity)
                    return (
                      (a =
                        t < 0 && !l
                          ? e.negPre + a + e.negSuf
                          : e.posPre + a + e.posSuf),
                      a
                    )
                  })(
                    t,
                    (function (t, e = '-') {
                      const n = {
                          minInt: 1,
                          minFrac: 0,
                          maxFrac: 0,
                          posPre: '',
                          posSuf: '',
                          negPre: '',
                          negSuf: '',
                          gSize: 0,
                          lgSize: 0
                        },
                        r = t.split(';'),
                        s = r[0],
                        i = r[1],
                        o =
                          -1 !== s.indexOf('.')
                            ? s.split('.')
                            : [
                                s.substring(0, s.lastIndexOf('0') + 1),
                                s.substring(s.lastIndexOf('0') + 1)
                              ],
                        a = o[0],
                        l = o[1] || ''
                      n.posPre = a.substr(0, a.indexOf('#'))
                      for (let c = 0; c < l.length; c++) {
                        const t = l.charAt(c)
                        '0' === t
                          ? (n.minFrac = n.maxFrac = c + 1)
                          : '#' === t
                          ? (n.maxFrac = c + 1)
                          : (n.posSuf += t)
                      }
                      const u = a.split(',')
                      if (
                        ((n.gSize = u[1] ? u[1].length : 0),
                        (n.lgSize = u[2] || u[1] ? (u[2] || u[1]).length : 0),
                        i)
                      ) {
                        const t = s.length - n.posPre.length - n.posSuf.length,
                          e = i.indexOf('#')
                        ;(n.negPre = i.substr(0, e).replace(/'/g, '')),
                          (n.negSuf = i.substr(e + t).replace(/'/g, ''))
                      } else (n.negPre = e + n.posPre), (n.negSuf = n.posSuf)
                      return n
                    })(
                      (function (t, e) {
                        return da(t)[fa.NumberFormats][e]
                      })(e, du.Decimal),
                      bu(e, yu.MinusSign)
                    ),
                    e,
                    yu.Group,
                    yu.Decimal,
                    n
                  )
                })(
                  (function (t) {
                    if (
                      'string' == typeof t &&
                      !isNaN(Number(t) - parseFloat(t))
                    )
                      return Number(t)
                    if ('number' != typeof t)
                      throw new Error(`${t} is not a number`)
                    return t
                  })(e),
                  r,
                  n
                )
              } catch (s) {
                throw Xu(t, s.message)
              }
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Pi(Xa))
            }),
            (t.ɵpipe = ye({ name: 'number', type: t, pure: !0 })),
            t
          )
        })(),
        nc = (() => {
          class t {}
          return (
            (t.ɵmod = fe({ type: t })),
            (t.ɵinj = ct({
              factory: function (e) {
                return new (e || t)()
              },
              providers: [{ provide: Hu, useClass: Gu }]
            })),
            t
          )
        })(),
        rc = (() => {
          class t {}
          return (
            (t.ɵprov = ut({
              token: t,
              providedIn: 'root',
              factory: () => new sc(Wt(Zl), window, Wt(nr))
            })),
            t
          )
        })()
      class sc {
        constructor (t, e, n) {
          ;(this.document = t),
            (this.window = e),
            (this.errorHandler = n),
            (this.offset = () => [0, 0])
        }
        setOffset (t) {
          this.offset = Array.isArray(t) ? () => t : t
        }
        getScrollPosition () {
          return this.supportScrollRestoration()
            ? [this.window.scrollX, this.window.scrollY]
            : [0, 0]
        }
        scrollToPosition (t) {
          this.supportScrollRestoration() && this.window.scrollTo(t[0], t[1])
        }
        scrollToAnchor (t) {
          if (this.supportScrollRestoration()) {
            t =
              this.window.CSS && this.window.CSS.escape
                ? this.window.CSS.escape(t)
                : t.replace(/(\"|\'\ |:|\.|\[|\]|,|=)/g, '\\$1')
            try {
              const e = this.document.querySelector(`#${t}`)
              if (e) return void this.scrollToElement(e)
              const n = this.document.querySelector(`[name='${t}']`)
              if (n) return void this.scrollToElement(n)
            } catch (e) {
              this.errorHandler.handleError(e)
            }
          }
        }
        setHistoryScrollRestoration (t) {
          if (this.supportScrollRestoration()) {
            const e = this.window.history
            e && e.scrollRestoration && (e.scrollRestoration = t)
          }
        }
        scrollToElement (t) {
          const e = t.getBoundingClientRect(),
            n = e.left + this.window.pageXOffset,
            r = e.top + this.window.pageYOffset,
            s = this.offset()
          this.window.scrollTo(n - s[0], r - s[1])
        }
        supportScrollRestoration () {
          try {
            return !!this.window && !!this.window.scrollTo
          } catch (t) {
            return !1
          }
        }
      }
      class ic extends class extends class {} {
        constructor () {
          super()
        }
        supportsDOMEvents () {
          return !0
        }
      } {
        static makeCurrent () {
          var t
          ;(t = new ic()), Bl || (Bl = t)
        }
        getProperty (t, e) {
          return t[e]
        }
        log (t) {
          window.console && window.console.log && window.console.log(t)
        }
        logGroup (t) {
          window.console && window.console.group && window.console.group(t)
        }
        logGroupEnd () {
          window.console && window.console.groupEnd && window.console.groupEnd()
        }
        onAndCancel (t, e, n) {
          return (
            t.addEventListener(e, n, !1),
            () => {
              t.removeEventListener(e, n, !1)
            }
          )
        }
        dispatchEvent (t, e) {
          t.dispatchEvent(e)
        }
        remove (t) {
          return t.parentNode && t.parentNode.removeChild(t), t
        }
        getValue (t) {
          return t.value
        }
        createElement (t, e) {
          return (e = e || this.getDefaultDocument()).createElement(t)
        }
        createHtmlDocument () {
          return document.implementation.createHTMLDocument('fakeTitle')
        }
        getDefaultDocument () {
          return document
        }
        isElementNode (t) {
          return t.nodeType === Node.ELEMENT_NODE
        }
        isShadowRoot (t) {
          return t instanceof DocumentFragment
        }
        getGlobalEventTarget (t, e) {
          return 'window' === e
            ? window
            : 'document' === e
            ? t
            : 'body' === e
            ? t.body
            : null
        }
        getHistory () {
          return window.history
        }
        getLocation () {
          return window.location
        }
        getBaseHref (t) {
          const e =
            ac || ((ac = document.querySelector('base')), ac)
              ? ac.getAttribute('href')
              : null
          return null == e
            ? null
            : ((n = e),
              oc || (oc = document.createElement('a')),
              oc.setAttribute('href', n),
              '/' === oc.pathname.charAt(0) ? oc.pathname : '/' + oc.pathname)
          var n
        }
        resetBaseElement () {
          ac = null
        }
        getUserAgent () {
          return window.navigator.userAgent
        }
        performanceNow () {
          return window.performance && window.performance.now
            ? window.performance.now()
            : new Date().getTime()
        }
        supportsCookies () {
          return !0
        }
        getCookie (t) {
          return zu(document.cookie, t)
        }
      }
      let oc,
        ac = null
      const lc = new jt('TRANSITION_ID'),
        uc = [
          {
            provide: za,
            useFactory: function (t, e, n) {
              return () => {
                n.get(qa).donePromise.then(() => {
                  const n = Wl()
                  Array.prototype.slice
                    .apply(e.querySelectorAll('style[ng-transition]'))
                    .filter(e => e.getAttribute('ng-transition') === t)
                    .forEach(t => n.remove(t))
                })
              }
            },
            deps: [lc, Zl, di],
            multi: !0
          }
        ]
      class cc {
        static init () {
          var t
          ;(t = new cc()), (El = t)
        }
        addToWindow (t) {
          ;(Ot.getAngularTestability = (e, n = !0) => {
            const r = t.findTestabilityInTree(e, n)
            if (null == r)
              throw new Error('Could not find testability for element.')
            return r
          }),
            (Ot.getAllAngularTestabilities = () => t.getAllTestabilities()),
            (Ot.getAllAngularRootElements = () => t.getAllRootElements()),
            Ot.frameworkStabilizers || (Ot.frameworkStabilizers = []),
            Ot.frameworkStabilizers.push(t => {
              const e = Ot.getAllAngularTestabilities()
              let n = e.length,
                r = !1
              const s = function (e) {
                ;(r = r || e), n--, 0 == n && t(r)
              }
              e.forEach(function (t) {
                t.whenStable(s)
              })
            })
        }
        findTestabilityInTree (t, e, n) {
          if (null == e) return null
          const r = t.getTestability(e)
          return null != r
            ? r
            : n
            ? Wl().isShadowRoot(e)
              ? this.findTestabilityInTree(t, e.host, !0)
              : this.findTestabilityInTree(t, e.parentElement, !0)
            : null
        }
      }
      const hc = new jt('EventManagerPlugins')
      let dc = (() => {
        class t {
          constructor (t, e) {
            ;(this._zone = e),
              (this._eventNameToPlugin = new Map()),
              t.forEach(t => (t.manager = this)),
              (this._plugins = t.slice().reverse())
          }
          addEventListener (t, e, n) {
            return this._findPluginFor(e).addEventListener(t, e, n)
          }
          addGlobalEventListener (t, e, n) {
            return this._findPluginFor(e).addGlobalEventListener(t, e, n)
          }
          getZone () {
            return this._zone
          }
          _findPluginFor (t) {
            const e = this._eventNameToPlugin.get(t)
            if (e) return e
            const n = this._plugins
            for (let r = 0; r < n.length; r++) {
              const e = n[r]
              if (e.supports(t)) return this._eventNameToPlugin.set(t, e), e
            }
            throw new Error(`No event manager plugin found for event ${t}`)
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Wt(hc), Wt(pl))
          }),
          (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
          t
        )
      })()
      class pc {
        constructor (t) {
          this._doc = t
        }
        addGlobalEventListener (t, e, n) {
          const r = Wl().getGlobalEventTarget(this._doc, t)
          if (!r)
            throw new Error(`Unsupported event target ${r} for event ${e}`)
          return this.addEventListener(r, e, n)
        }
      }
      let fc = (() => {
          class t {
            constructor () {
              this._stylesSet = new Set()
            }
            addStyles (t) {
              const e = new Set()
              t.forEach(t => {
                this._stylesSet.has(t) || (this._stylesSet.add(t), e.add(t))
              }),
                this.onStylesAdded(e)
            }
            onStylesAdded (t) {}
            getAllStyles () {
              return Array.from(this._stylesSet)
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)()
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })(),
        gc = (() => {
          class t extends fc {
            constructor (t) {
              super(),
                (this._doc = t),
                (this._hostNodes = new Set()),
                (this._styleNodes = new Set()),
                this._hostNodes.add(t.head)
            }
            _addStylesToHost (t, e) {
              t.forEach(t => {
                const n = this._doc.createElement('style')
                ;(n.textContent = t), this._styleNodes.add(e.appendChild(n))
              })
            }
            addHost (t) {
              this._addStylesToHost(this._stylesSet, t), this._hostNodes.add(t)
            }
            removeHost (t) {
              this._hostNodes.delete(t)
            }
            onStylesAdded (t) {
              this._hostNodes.forEach(e => this._addStylesToHost(t, e))
            }
            ngOnDestroy () {
              this._styleNodes.forEach(t => Wl().remove(t))
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Wt(Zl))
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })()
      const mc = {
          svg: 'http://www.w3.org/2000/svg',
          xhtml: 'http://www.w3.org/1999/xhtml',
          xlink: 'http://www.w3.org/1999/xlink',
          xml: 'http://www.w3.org/XML/1998/namespace',
          xmlns: 'http://www.w3.org/2000/xmlns/'
        },
        yc = /%COMP%/g
      function vc (t, e, n) {
        for (let r = 0; r < e.length; r++) {
          let s = e[r]
          Array.isArray(s) ? vc(t, s, n) : ((s = s.replace(yc, t)), n.push(s))
        }
        return n
      }
      function _c (t) {
        return e => {
          if ('__ngUnwrap__' === e) return t
          !1 === t(e) && (e.preventDefault(), (e.returnValue = !1))
        }
      }
      let wc = (() => {
        class t {
          constructor (t, e, n) {
            ;(this.eventManager = t),
              (this.sharedStylesHost = e),
              (this.appId = n),
              (this.rendererByCompId = new Map()),
              (this.defaultRenderer = new bc(t))
          }
          createRenderer (t, e) {
            if (!t || !e) return this.defaultRenderer
            switch (e.encapsulation) {
              case oe.Emulated: {
                let n = this.rendererByCompId.get(e.id)
                return (
                  n ||
                    ((n = new Cc(
                      this.eventManager,
                      this.sharedStylesHost,
                      e,
                      this.appId
                    )),
                    this.rendererByCompId.set(e.id, n)),
                  n.applyToHost(t),
                  n
                )
              }
              case oe.Native:
              case oe.ShadowDom:
                return new Sc(this.eventManager, this.sharedStylesHost, t, e)
              default:
                if (!this.rendererByCompId.has(e.id)) {
                  const t = vc(e.id, e.styles, [])
                  this.sharedStylesHost.addStyles(t),
                    this.rendererByCompId.set(e.id, this.defaultRenderer)
                }
                return this.defaultRenderer
            }
          }
          begin () {}
          end () {}
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Wt(dc), Wt(gc), Wt(Ba))
          }),
          (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
          t
        )
      })()
      class bc {
        constructor (t) {
          ;(this.eventManager = t), (this.data = Object.create(null))
        }
        destroy () {}
        createElement (t, e) {
          return e
            ? document.createElementNS(mc[e] || e, t)
            : document.createElement(t)
        }
        createComment (t) {
          return document.createComment(t)
        }
        createText (t) {
          return document.createTextNode(t)
        }
        appendChild (t, e) {
          t.appendChild(e)
        }
        insertBefore (t, e, n) {
          t && t.insertBefore(e, n)
        }
        removeChild (t, e) {
          t && t.removeChild(e)
        }
        selectRootElement (t, e) {
          let n = 'string' == typeof t ? document.querySelector(t) : t
          if (!n)
            throw new Error(`The selector "${t}" did not match any elements`)
          return e || (n.textContent = ''), n
        }
        parentNode (t) {
          return t.parentNode
        }
        nextSibling (t) {
          return t.nextSibling
        }
        setAttribute (t, e, n, r) {
          if (r) {
            e = r + ':' + e
            const s = mc[r]
            s ? t.setAttributeNS(s, e, n) : t.setAttribute(e, n)
          } else t.setAttribute(e, n)
        }
        removeAttribute (t, e, n) {
          if (n) {
            const r = mc[n]
            r ? t.removeAttributeNS(r, e) : t.removeAttribute(`${n}:${e}`)
          } else t.removeAttribute(e)
        }
        addClass (t, e) {
          t.classList.add(e)
        }
        removeClass (t, e) {
          t.classList.remove(e)
        }
        setStyle (t, e, n, r) {
          r & Po.DashCase
            ? t.style.setProperty(e, n, r & Po.Important ? 'important' : '')
            : (t.style[e] = n)
        }
        removeStyle (t, e, n) {
          n & Po.DashCase ? t.style.removeProperty(e) : (t.style[e] = '')
        }
        setProperty (t, e, n) {
          t[e] = n
        }
        setValue (t, e) {
          t.nodeValue = e
        }
        listen (t, e, n) {
          return 'string' == typeof t
            ? this.eventManager.addGlobalEventListener(t, e, _c(n))
            : this.eventManager.addEventListener(t, e, _c(n))
        }
      }
      class Cc extends bc {
        constructor (t, e, n, r) {
          super(t), (this.component = n)
          const s = vc(r + '-' + n.id, n.styles, [])
          e.addStyles(s),
            (this.contentAttr = '_ngcontent-%COMP%'.replace(
              yc,
              r + '-' + n.id
            )),
            (this.hostAttr = (function (t) {
              return '_nghost-%COMP%'.replace(yc, t)
            })(r + '-' + n.id))
        }
        applyToHost (t) {
          super.setAttribute(t, this.hostAttr, '')
        }
        createElement (t, e) {
          const n = super.createElement(t, e)
          return super.setAttribute(n, this.contentAttr, ''), n
        }
      }
      class Sc extends bc {
        constructor (t, e, n, r) {
          super(t),
            (this.sharedStylesHost = e),
            (this.hostEl = n),
            (this.component = r),
            (this.shadowRoot =
              r.encapsulation === oe.ShadowDom
                ? n.attachShadow({ mode: 'open' })
                : n.createShadowRoot()),
            this.sharedStylesHost.addHost(this.shadowRoot)
          const s = vc(r.id, r.styles, [])
          for (let i = 0; i < s.length; i++) {
            const t = document.createElement('style')
            ;(t.textContent = s[i]), this.shadowRoot.appendChild(t)
          }
        }
        nodeOrShadowRoot (t) {
          return t === this.hostEl ? this.shadowRoot : t
        }
        destroy () {
          this.sharedStylesHost.removeHost(this.shadowRoot)
        }
        appendChild (t, e) {
          return super.appendChild(this.nodeOrShadowRoot(t), e)
        }
        insertBefore (t, e, n) {
          return super.insertBefore(this.nodeOrShadowRoot(t), e, n)
        }
        removeChild (t, e) {
          return super.removeChild(this.nodeOrShadowRoot(t), e)
        }
        parentNode (t) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(t))
          )
        }
      }
      const xc = ['alt', 'control', 'meta', 'shift'],
        Ec = {
          '\b': 'Backspace',
          '\t': 'Tab',
          '\x7f': 'Delete',
          '\x1b': 'Escape',
          Del: 'Delete',
          Esc: 'Escape',
          Left: 'ArrowLeft',
          Right: 'ArrowRight',
          Up: 'ArrowUp',
          Down: 'ArrowDown',
          Menu: 'ContextMenu',
          Scroll: 'ScrollLock',
          Win: 'OS'
        },
        Tc = {
          A: '1',
          B: '2',
          C: '3',
          D: '4',
          E: '5',
          F: '6',
          G: '7',
          H: '8',
          I: '9',
          J: '*',
          K: '+',
          M: '-',
          N: '.',
          O: '/',
          '`': '0',
          '\x90': 'NumLock'
        },
        kc = {
          alt: t => t.altKey,
          control: t => t.ctrlKey,
          meta: t => t.metaKey,
          shift: t => t.shiftKey
        },
        Ac = [
          { provide: Ja, useValue: 'browser' },
          {
            provide: Qa,
            useValue: function () {
              ic.makeCurrent(), cc.init()
            },
            multi: !0
          },
          {
            provide: Zl,
            useFactory: function () {
              return (
                (function (t) {
                  Ae = t
                })(document),
                document
              )
            },
            deps: []
          }
        ],
        Oc = [
          [],
          { provide: Ys, useValue: 'root' },
          {
            provide: nr,
            useFactory: function () {
              return new nr()
            },
            deps: []
          },
          {
            provide: hc,
            useClass: (() => {
              class t extends pc {
                constructor (t) {
                  super(t)
                }
                supports (t) {
                  return !0
                }
                addEventListener (t, e, n) {
                  return (
                    t.addEventListener(e, n, !1),
                    () => this.removeEventListener(t, e, n)
                  )
                }
                removeEventListener (t, e, n) {
                  return t.removeEventListener(e, n)
                }
              }
              return (
                (t.ɵfac = function (e) {
                  return new (e || t)(Wt(Zl))
                }),
                (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
                t
              )
            })(),
            multi: !0,
            deps: [Zl, pl, Ja]
          },
          {
            provide: hc,
            useClass: (() => {
              class t extends pc {
                constructor (t) {
                  super(t)
                }
                supports (e) {
                  return null != t.parseEventName(e)
                }
                addEventListener (e, n, r) {
                  const s = t.parseEventName(n),
                    i = t.eventCallback(s.fullKey, r, this.manager.getZone())
                  return this.manager
                    .getZone()
                    .runOutsideAngular(() =>
                      Wl().onAndCancel(e, s.domEventName, i)
                    )
                }
                static parseEventName (e) {
                  const n = e.toLowerCase().split('.'),
                    r = n.shift()
                  if (0 === n.length || ('keydown' !== r && 'keyup' !== r))
                    return null
                  const s = t._normalizeKey(n.pop())
                  let i = ''
                  if (
                    (xc.forEach(t => {
                      const e = n.indexOf(t)
                      e > -1 && (n.splice(e, 1), (i += t + '.'))
                    }),
                    (i += s),
                    0 != n.length || 0 === s.length)
                  )
                    return null
                  const o = {}
                  return (o.domEventName = r), (o.fullKey = i), o
                }
                static getEventFullKey (t) {
                  let e = '',
                    n = (function (t) {
                      let e = t.key
                      if (null == e) {
                        if (((e = t.keyIdentifier), null == e))
                          return 'Unidentified'
                        e.startsWith('U+') &&
                          ((e = String.fromCharCode(
                            parseInt(e.substring(2), 16)
                          )),
                          3 === t.location &&
                            Tc.hasOwnProperty(e) &&
                            (e = Tc[e]))
                      }
                      return Ec[e] || e
                    })(t)
                  return (
                    (n = n.toLowerCase()),
                    ' ' === n ? (n = 'space') : '.' === n && (n = 'dot'),
                    xc.forEach(r => {
                      r != n && (0, kc[r])(t) && (e += r + '.')
                    }),
                    (e += n),
                    e
                  )
                }
                static eventCallback (e, n, r) {
                  return s => {
                    t.getEventFullKey(s) === e && r.runGuarded(() => n(s))
                  }
                }
                static _normalizeKey (t) {
                  switch (t) {
                    case 'esc':
                      return 'escape'
                    default:
                      return t
                  }
                }
              }
              return (
                (t.ɵfac = function (e) {
                  return new (e || t)(Wt(Zl))
                }),
                (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
                t
              )
            })(),
            multi: !0,
            deps: [Zl]
          },
          [],
          { provide: wc, useClass: wc, deps: [dc, gc, Ba] },
          { provide: Mo, useExisting: wc },
          { provide: fc, useExisting: gc },
          { provide: gc, useClass: gc, deps: [Zl] },
          { provide: bl, useClass: bl, deps: [pl] },
          { provide: dc, useClass: dc, deps: [hc, pl] },
          []
        ]
      let Ic = (() => {
        class t {
          constructor (t) {
            if (t)
              throw new Error(
                'BrowserModule has already been loaded. If you need access to common directives such as NgIf and NgFor from a lazy loaded module, import CommonModule instead.'
              )
          }
          static withServerTransition (e) {
            return {
              ngModule: t,
              providers: [
                { provide: Ba, useValue: e.appId },
                { provide: lc, useExisting: Ba },
                uc
              ]
            }
          }
        }
        return (
          (t.ɵmod = fe({ type: t })),
          (t.ɵinj = ct({
            factory: function (e) {
              return new (e || t)(Wt(t, 12))
            },
            providers: Oc,
            imports: [nc, Hl]
          })),
          t
        )
      })()
      'undefined' != typeof window && window
      const Mc = [{ provide: ul, useFactory: () => new ul() }]
      function Pc (t) {
        for (let e = t.length - 1; e >= 0; e--) if (void 0 !== t[e]) return t[e]
      }
      function Rc (t) {
        const e = []
        return t.forEach(t => t && e.push(...t)), e
      }
      const Nc = Ol(Ll, 'coreDynamic', [
        { provide: cl, useValue: {}, multi: !0 },
        {
          provide: class {},
          useClass: class {
            constructor (t) {
              this._defaultOptions = [
                {
                  useJit: !0,
                  defaultEncapsulation: oe.Emulated,
                  missingTranslation: el.Warning
                },
                ...t
              ]
            }
            createCompiler (t = []) {
              const e = {
                useJit: Pc(
                  (n = this._defaultOptions.concat(t)).map(t => t.useJit)
                ),
                defaultEncapsulation: Pc(n.map(t => t.defaultEncapsulation)),
                providers: Rc(n.map(t => t.providers)),
                missingTranslation: Pc(n.map(t => t.missingTranslation)),
                preserveWhitespaces: Pc(n.map(t => t.preserveWhitespaces))
              }
              var n
              return di
                .create([
                  Mc,
                  {
                    provide: ql,
                    useFactory: () =>
                      new ql({
                        useJit: e.useJit,
                        jitDevMode: ar(),
                        defaultEncapsulation: e.defaultEncapsulation,
                        missingTranslation: e.missingTranslation,
                        preserveWhitespaces: e.preserveWhitespaces
                      }),
                    deps: []
                  },
                  e.providers
                ])
                .get(ul)
            }
          },
          deps: [cl]
        }
      ])
      let Dc = (() => {
        class t extends zl {
          get (t) {
            let e, n
            const r = new Promise((t, r) => {
                ;(e = t), (n = r)
              }),
              s = new XMLHttpRequest()
            return (
              s.open('GET', t, !0),
              (s.responseType = 'text'),
              (s.onload = function () {
                const r = s.response || s.responseText
                let i = 1223 === s.status ? 204 : s.status
                0 === i && (i = r ? 200 : 0),
                  200 <= i && i <= 300 ? e(r) : n(`Failed to load ${t}`)
              }),
              (s.onerror = function () {
                n(`Failed to load ${t}`)
              }),
              s.send(),
              r
            )
          }
        }
        return (
          (t.ɵfac = function (e) {
            return Vc(e || t)
          }),
          (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
          t
        )
      })()
      const Vc = Yn(Dc),
        jc = Ol(Nc, 'browserDynamic', [
          Ac,
          {
            provide: cl,
            useValue: { providers: [{ provide: zl, useClass: Dc, deps: [] }] },
            multi: !0
          },
          { provide: Ja, useValue: 'browser' }
        ])
      function Fc (...t) {
        let e = t[t.length - 1]
        return k(e) ? (t.pop(), L(t, e)) : B(t)
      }
      class Uc extends E {
        constructor (t) {
          super(), (this._value = t)
        }
        get value () {
          return this.getValue()
        }
        _subscribe (t) {
          const e = super._subscribe(t)
          return e && !e.closed && t.next(this._value), e
        }
        getValue () {
          if (this.hasError) throw this.thrownError
          if (this.closed) throw new C()
          return this._value
        }
        next (t) {
          super.next((this._value = t))
        }
      }
      const Lc = (() => {
          function t () {
            return (
              Error.call(this),
              (this.message = 'no elements in sequence'),
              (this.name = 'EmptyError'),
              this
            )
          }
          return (t.prototype = Object.create(Error.prototype)), t
        })(),
        $c = {}
      class Hc {
        constructor (t) {
          this.resultSelector = t
        }
        call (t, e) {
          return e.subscribe(new Gc(t, this.resultSelector))
        }
      }
      class Gc extends V {
        constructor (t, e) {
          super(t),
            (this.resultSelector = e),
            (this.active = 0),
            (this.values = []),
            (this.observables = [])
        }
        _next (t) {
          this.values.push($c), this.observables.push(t)
        }
        _complete () {
          const t = this.observables,
            e = t.length
          if (0 === e) this.destination.complete()
          else {
            ;(this.active = e), (this.toRespond = e)
            for (let n = 0; n < e; n++) {
              const e = t[n]
              this.add(D(this, e, e, n))
            }
          }
        }
        notifyComplete (t) {
          0 == (this.active -= 1) && this.destination.complete()
        }
        notifyNext (t, e, n, r, s) {
          const i = this.values,
            o = this.toRespond
              ? i[n] === $c
                ? --this.toRespond
                : this.toRespond
              : 0
          ;(i[n] = e),
            0 === o &&
              (this.resultSelector
                ? this._tryResultSelector(i)
                : this.destination.next(i.slice()))
        }
        _tryResultSelector (t) {
          let e
          try {
            e = this.resultSelector.apply(this, t)
          } catch (n) {
            return void this.destination.error(n)
          }
          this.destination.next(e)
        }
      }
      const zc = new w(t => t.complete())
      function qc (t) {
        return t
          ? (function (t) {
              return new w(e => t.schedule(() => e.complete()))
            })(t)
          : zc
      }
      function Bc (t) {
        return new w(e => {
          let n
          try {
            n = t()
          } catch (r) {
            return void e.error(r)
          }
          return (n ? $(n) : qc()).subscribe(e)
        })
      }
      function Wc () {
        return q(1)
      }
      function Zc (t, e) {
        return function (n) {
          return n.lift(new Qc(t, e))
        }
      }
      class Qc {
        constructor (t, e) {
          ;(this.predicate = t), (this.thisArg = e)
        }
        call (t, e) {
          return e.subscribe(new Jc(t, this.predicate, this.thisArg))
        }
      }
      class Jc extends f {
        constructor (t, e, n) {
          super(t), (this.predicate = e), (this.thisArg = n), (this.count = 0)
        }
        _next (t) {
          let e
          try {
            e = this.predicate.call(this.thisArg, t, this.count++)
          } catch (n) {
            return void this.destination.error(n)
          }
          e && this.destination.next(t)
        }
      }
      const Kc = (() => {
        function t () {
          return (
            Error.call(this),
            (this.message = 'argument out of range'),
            (this.name = 'ArgumentOutOfRangeError'),
            this
          )
        }
        return (t.prototype = Object.create(Error.prototype)), t
      })()
      function Yc (t) {
        return function (e) {
          return 0 === t ? qc() : e.lift(new Xc(t))
        }
      }
      class Xc {
        constructor (t) {
          if (((this.total = t), this.total < 0)) throw new Kc()
        }
        call (t, e) {
          return e.subscribe(new th(t, this.total))
        }
      }
      class th extends f {
        constructor (t, e) {
          super(t),
            (this.total = e),
            (this.ring = new Array()),
            (this.count = 0)
        }
        _next (t) {
          const e = this.ring,
            n = this.total,
            r = this.count++
          e.length < n ? e.push(t) : (e[r % n] = t)
        }
        _complete () {
          const t = this.destination
          let e = this.count
          if (e > 0) {
            const n = this.count >= this.total ? this.total : this.count,
              r = this.ring
            for (let s = 0; s < n; s++) {
              const s = e++ % n
              t.next(r[s])
            }
          }
          t.complete()
        }
      }
      function eh (t = sh) {
        return e => e.lift(new nh(t))
      }
      class nh {
        constructor (t) {
          this.errorFactory = t
        }
        call (t, e) {
          return e.subscribe(new rh(t, this.errorFactory))
        }
      }
      class rh extends f {
        constructor (t, e) {
          super(t), (this.errorFactory = e), (this.hasValue = !1)
        }
        _next (t) {
          ;(this.hasValue = !0), this.destination.next(t)
        }
        _complete () {
          if (this.hasValue) return this.destination.complete()
          {
            let e
            try {
              e = this.errorFactory()
            } catch (t) {
              e = t
            }
            this.destination.error(e)
          }
        }
      }
      function sh () {
        return new Lc()
      }
      function ih (t = null) {
        return e => e.lift(new oh(t))
      }
      class oh {
        constructor (t) {
          this.defaultValue = t
        }
        call (t, e) {
          return e.subscribe(new ah(t, this.defaultValue))
        }
      }
      class ah extends f {
        constructor (t, e) {
          super(t), (this.defaultValue = e), (this.isEmpty = !0)
        }
        _next (t) {
          ;(this.isEmpty = !1), this.destination.next(t)
        }
        _complete () {
          this.isEmpty && this.destination.next(this.defaultValue),
            this.destination.complete()
        }
      }
      function lh (t, e) {
        const n = arguments.length >= 2
        return r =>
          r.pipe(
            t ? Zc((e, n) => t(e, n, r)) : y,
            Yc(1),
            n ? ih(e) : eh(() => new Lc())
          )
      }
      function uh (t) {
        return function (e) {
          const n = new ch(t),
            r = e.lift(n)
          return (n.caught = r)
        }
      }
      class ch {
        constructor (t) {
          this.selector = t
        }
        call (t, e) {
          return e.subscribe(new hh(t, this.selector, this.caught))
        }
      }
      class hh extends V {
        constructor (t, e, n) {
          super(t), (this.selector = e), (this.caught = n)
        }
        error (t) {
          if (!this.isStopped) {
            let n
            try {
              n = this.selector(t, this.caught)
            } catch (e) {
              return void super.error(e)
            }
            this._unsubscribeAndRecycle()
            const r = new A(this, void 0, void 0)
            this.add(r)
            const s = D(this, n, void 0, void 0, r)
            s !== r && this.add(s)
          }
        }
      }
      function dh (t) {
        return e => (0 === t ? qc() : e.lift(new ph(t)))
      }
      class ph {
        constructor (t) {
          if (((this.total = t), this.total < 0)) throw new Kc()
        }
        call (t, e) {
          return e.subscribe(new fh(t, this.total))
        }
      }
      class fh extends f {
        constructor (t, e) {
          super(t), (this.total = e), (this.count = 0)
        }
        _next (t) {
          const e = this.total,
            n = ++this.count
          n <= e &&
            (this.destination.next(t),
            n === e && (this.destination.complete(), this.unsubscribe()))
        }
      }
      function gh (t, e) {
        const n = arguments.length >= 2
        return r =>
          r.pipe(
            t ? Zc((e, n) => t(e, n, r)) : y,
            dh(1),
            n ? ih(e) : eh(() => new Lc())
          )
      }
      class mh {
        constructor (t, e, n) {
          ;(this.predicate = t), (this.thisArg = e), (this.source = n)
        }
        call (t, e) {
          return e.subscribe(
            new yh(t, this.predicate, this.thisArg, this.source)
          )
        }
      }
      class yh extends f {
        constructor (t, e, n, r) {
          super(t),
            (this.predicate = e),
            (this.thisArg = n),
            (this.source = r),
            (this.index = 0),
            (this.thisArg = n || this)
        }
        notifyComplete (t) {
          this.destination.next(t), this.destination.complete()
        }
        _next (t) {
          let e = !1
          try {
            e = this.predicate.call(this.thisArg, t, this.index++, this.source)
          } catch (n) {
            return void this.destination.error(n)
          }
          e || this.notifyComplete(!1)
        }
        _complete () {
          this.notifyComplete(!0)
        }
      }
      function vh (t, e) {
        return 'function' == typeof e
          ? n =>
              n.pipe(vh((n, r) => $(t(n, r)).pipe(j((t, s) => e(n, t, r, s)))))
          : e => e.lift(new _h(t))
      }
      class _h {
        constructor (t) {
          this.project = t
        }
        call (t, e) {
          return e.subscribe(new wh(t, this.project))
        }
      }
      class wh extends V {
        constructor (t, e) {
          super(t), (this.project = e), (this.index = 0)
        }
        _next (t) {
          let e
          const n = this.index++
          try {
            e = this.project(t, n)
          } catch (r) {
            return void this.destination.error(r)
          }
          this._innerSub(e, t, n)
        }
        _innerSub (t, e, n) {
          const r = this.innerSubscription
          r && r.unsubscribe()
          const s = new A(this, e, n),
            i = this.destination
          i.add(s),
            (this.innerSubscription = D(this, t, void 0, void 0, s)),
            this.innerSubscription !== s && i.add(this.innerSubscription)
        }
        _complete () {
          const { innerSubscription: t } = this
          ;(t && !t.closed) || super._complete(), this.unsubscribe()
        }
        _unsubscribe () {
          this.innerSubscription = null
        }
        notifyComplete (t) {
          this.destination.remove(t),
            (this.innerSubscription = null),
            this.isStopped && super._complete()
        }
        notifyNext (t, e, n, r, s) {
          this.destination.next(e)
        }
      }
      function bh (...t) {
        return Wc()(Fc(...t))
      }
      function Ch (t, e) {
        let n = !1
        return (
          arguments.length >= 2 && (n = !0),
          function (r) {
            return r.lift(new Sh(t, e, n))
          }
        )
      }
      class Sh {
        constructor (t, e, n = !1) {
          ;(this.accumulator = t), (this.seed = e), (this.hasSeed = n)
        }
        call (t, e) {
          return e.subscribe(
            new xh(t, this.accumulator, this.seed, this.hasSeed)
          )
        }
      }
      class xh extends f {
        constructor (t, e, n, r) {
          super(t),
            (this.accumulator = e),
            (this._seed = n),
            (this.hasSeed = r),
            (this.index = 0)
        }
        get seed () {
          return this._seed
        }
        set seed (t) {
          ;(this.hasSeed = !0), (this._seed = t)
        }
        _next (t) {
          if (this.hasSeed) return this._tryNext(t)
          ;(this.seed = t), this.destination.next(t)
        }
        _tryNext (t) {
          const e = this.index++
          let n
          try {
            n = this.accumulator(this.seed, t, e)
          } catch (r) {
            this.destination.error(r)
          }
          ;(this.seed = n), this.destination.next(n)
        }
      }
      function Eh (t, e) {
        return H(t, e, 1)
      }
      function Th () {}
      function kh (t, e, n) {
        return function (r) {
          return r.lift(new Ah(t, e, n))
        }
      }
      class Ah {
        constructor (t, e, n) {
          ;(this.nextOrObserver = t), (this.error = e), (this.complete = n)
        }
        call (t, e) {
          return e.subscribe(
            new Oh(t, this.nextOrObserver, this.error, this.complete)
          )
        }
      }
      class Oh extends f {
        constructor (t, e, n, s) {
          super(t),
            (this._tapNext = Th),
            (this._tapError = Th),
            (this._tapComplete = Th),
            (this._tapError = n || Th),
            (this._tapComplete = s || Th),
            r(e)
              ? ((this._context = this), (this._tapNext = e))
              : e &&
                ((this._context = e),
                (this._tapNext = e.next || Th),
                (this._tapError = e.error || Th),
                (this._tapComplete = e.complete || Th))
        }
        _next (t) {
          try {
            this._tapNext.call(this._context, t)
          } catch (e) {
            return void this.destination.error(e)
          }
          this.destination.next(t)
        }
        _error (t) {
          try {
            this._tapError.call(this._context, t)
          } catch (t) {
            return void this.destination.error(t)
          }
          this.destination.error(t)
        }
        _complete () {
          try {
            this._tapComplete.call(this._context)
          } catch (t) {
            return void this.destination.error(t)
          }
          return this.destination.complete()
        }
      }
      class Ih {
        constructor (t) {
          this.callback = t
        }
        call (t, e) {
          return e.subscribe(new Mh(t, this.callback))
        }
      }
      class Mh extends f {
        constructor (t, e) {
          super(t), this.add(new h(e))
        }
      }
      class Ph {
        constructor (t, e) {
          ;(this.id = t), (this.url = e)
        }
      }
      class Rh extends Ph {
        constructor (t, e, n = 'imperative', r = null) {
          super(t, e), (this.navigationTrigger = n), (this.restoredState = r)
        }
        toString () {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`
        }
      }
      class Nh extends Ph {
        constructor (t, e, n) {
          super(t, e), (this.urlAfterRedirects = n)
        }
        toString () {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`
        }
      }
      class Dh extends Ph {
        constructor (t, e, n) {
          super(t, e), (this.reason = n)
        }
        toString () {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`
        }
      }
      class Vh extends Ph {
        constructor (t, e, n) {
          super(t, e), (this.error = n)
        }
        toString () {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`
        }
      }
      class jh extends Ph {
        constructor (t, e, n, r) {
          super(t, e), (this.urlAfterRedirects = n), (this.state = r)
        }
        toString () {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
      }
      class Fh extends Ph {
        constructor (t, e, n, r) {
          super(t, e), (this.urlAfterRedirects = n), (this.state = r)
        }
        toString () {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
      }
      class Uh extends Ph {
        constructor (t, e, n, r, s) {
          super(t, e),
            (this.urlAfterRedirects = n),
            (this.state = r),
            (this.shouldActivate = s)
        }
        toString () {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`
        }
      }
      class Lh extends Ph {
        constructor (t, e, n, r) {
          super(t, e), (this.urlAfterRedirects = n), (this.state = r)
        }
        toString () {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
      }
      class $h extends Ph {
        constructor (t, e, n, r) {
          super(t, e), (this.urlAfterRedirects = n), (this.state = r)
        }
        toString () {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
        }
      }
      class Hh {
        constructor (t) {
          this.route = t
        }
        toString () {
          return `RouteConfigLoadStart(path: ${this.route.path})`
        }
      }
      class Gh {
        constructor (t) {
          this.route = t
        }
        toString () {
          return `RouteConfigLoadEnd(path: ${this.route.path})`
        }
      }
      class zh {
        constructor (t) {
          this.snapshot = t
        }
        toString () {
          return `ChildActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''
          }')`
        }
      }
      class qh {
        constructor (t) {
          this.snapshot = t
        }
        toString () {
          return `ChildActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''
          }')`
        }
      }
      class Bh {
        constructor (t) {
          this.snapshot = t
        }
        toString () {
          return `ActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''
          }')`
        }
      }
      class Wh {
        constructor (t) {
          this.snapshot = t
        }
        toString () {
          return `ActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''
          }')`
        }
      }
      class Zh {
        constructor (t, e, n) {
          ;(this.routerEvent = t), (this.position = e), (this.anchor = n)
        }
        toString () {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`
        }
      }
      let Qh = (() => {
        class t {}
        return (
          (t.ɵfac = function (e) {
            return new (e || t)()
          }),
          (t.ɵcmp = ce({
            type: t,
            selectors: [['ng-component']],
            decls: 1,
            vars: 0,
            template: function (t, e) {
              1 & t && Fi(0, 'router-outlet')
            },
            directives: function () {
              return [Jp]
            },
            encapsulation: 2
          })),
          t
        )
      })()
      class Jh {
        constructor (t) {
          this.params = t || {}
        }
        has (t) {
          return this.params.hasOwnProperty(t)
        }
        get (t) {
          if (this.has(t)) {
            const e = this.params[t]
            return Array.isArray(e) ? e[0] : e
          }
          return null
        }
        getAll (t) {
          if (this.has(t)) {
            const e = this.params[t]
            return Array.isArray(e) ? e : [e]
          }
          return []
        }
        get keys () {
          return Object.keys(this.params)
        }
      }
      function Kh (t) {
        return new Jh(t)
      }
      function Yh (t) {
        const e = Error('NavigationCancelingError: ' + t)
        return (e.ngNavigationCancelingError = !0), e
      }
      function Xh (t, e, n) {
        const r = n.path.split('/')
        if (r.length > t.length) return null
        if ('full' === n.pathMatch && (e.hasChildren() || r.length < t.length))
          return null
        const s = {}
        for (let i = 0; i < r.length; i++) {
          const e = r[i],
            n = t[i]
          if (e.startsWith(':')) s[e.substring(1)] = n
          else if (e !== n.path) return null
        }
        return { consumed: t.slice(0, r.length), posParams: s }
      }
      class td {
        constructor (t, e) {
          ;(this.routes = t), (this.module = e)
        }
      }
      function ed (t, e = '') {
        for (let n = 0; n < t.length; n++) {
          const r = t[n]
          nd(r, rd(e, r))
        }
      }
      function nd (t, e) {
        if (!t)
          throw new Error(
            `\n      Invalid configuration of route '${e}': Encountered undefined route.\n      The reason might be an extra comma.\n\n      Example:\n      const routes: Routes = [\n        { path: '', redirectTo: '/dashboard', pathMatch: 'full' },\n        { path: 'dashboard',  component: DashboardComponent },, << two commas\n        { path: 'detail/:id', component: HeroDetailComponent }\n      ];\n    `
          )
        if (Array.isArray(t))
          throw new Error(
            `Invalid configuration of route '${e}': Array cannot be specified`
          )
        if (
          !t.component &&
          !t.children &&
          !t.loadChildren &&
          t.outlet &&
          'primary' !== t.outlet
        )
          throw new Error(
            `Invalid configuration of route '${e}': a componentless route without children or loadChildren cannot have a named outlet set`
          )
        if (t.redirectTo && t.children)
          throw new Error(
            `Invalid configuration of route '${e}': redirectTo and children cannot be used together`
          )
        if (t.redirectTo && t.loadChildren)
          throw new Error(
            `Invalid configuration of route '${e}': redirectTo and loadChildren cannot be used together`
          )
        if (t.children && t.loadChildren)
          throw new Error(
            `Invalid configuration of route '${e}': children and loadChildren cannot be used together`
          )
        if (t.redirectTo && t.component)
          throw new Error(
            `Invalid configuration of route '${e}': redirectTo and component cannot be used together`
          )
        if (t.path && t.matcher)
          throw new Error(
            `Invalid configuration of route '${e}': path and matcher cannot be used together`
          )
        if (
          void 0 === t.redirectTo &&
          !t.component &&
          !t.children &&
          !t.loadChildren
        )
          throw new Error(
            `Invalid configuration of route '${e}'. One of the following must be provided: component, redirectTo, children or loadChildren`
          )
        if (void 0 === t.path && void 0 === t.matcher)
          throw new Error(
            `Invalid configuration of route '${e}': routes must have either a path or a matcher specified`
          )
        if ('string' == typeof t.path && '/' === t.path.charAt(0))
          throw new Error(
            `Invalid configuration of route '${e}': path cannot start with a slash`
          )
        if ('' === t.path && void 0 !== t.redirectTo && void 0 === t.pathMatch)
          throw new Error(
            `Invalid configuration of route '{path: "${e}", redirectTo: "${t.redirectTo}"}': please provide 'pathMatch'. The default value of 'pathMatch' is 'prefix', but often the intent is to use 'full'.`
          )
        if (
          void 0 !== t.pathMatch &&
          'full' !== t.pathMatch &&
          'prefix' !== t.pathMatch
        )
          throw new Error(
            `Invalid configuration of route '${e}': pathMatch can only be set to 'prefix' or 'full'`
          )
        t.children && ed(t.children, e)
      }
      function rd (t, e) {
        return e
          ? t || e.path
            ? t && !e.path
              ? `${t}/`
              : !t && e.path
              ? e.path
              : `${t}/${e.path}`
            : ''
          : t
      }
      function sd (t) {
        const e = t.children && t.children.map(sd),
          n = e
            ? Object.assign(Object.assign({}, t), { children: e })
            : Object.assign({}, t)
        return (
          !n.component &&
            (e || n.loadChildren) &&
            n.outlet &&
            'primary' !== n.outlet &&
            (n.component = Qh),
          n
        )
      }
      function id (t, e) {
        const n = Object.keys(t),
          r = Object.keys(e)
        if (!n || !r || n.length != r.length) return !1
        let s
        for (let i = 0; i < n.length; i++)
          if (((s = n[i]), !od(t[s], e[s]))) return !1
        return !0
      }
      function od (t, e) {
        return Array.isArray(t) && Array.isArray(e)
          ? t.length == e.length && t.every(t => e.indexOf(t) > -1)
          : t === e
      }
      function ad (t) {
        return Array.prototype.concat.apply([], t)
      }
      function ld (t) {
        return t.length > 0 ? t[t.length - 1] : null
      }
      function ud (t, e) {
        for (const n in t) t.hasOwnProperty(n) && e(t[n], n)
      }
      function cd (t) {
        return $i(t) ? t : Li(t) ? $(Promise.resolve(t)) : Fc(t)
      }
      function hd (t, e, n) {
        return n
          ? (function (t, e) {
              return id(t, e)
            })(t.queryParams, e.queryParams) &&
              (function t (e, n) {
                if (!gd(e.segments, n.segments)) return !1
                if (e.numberOfChildren !== n.numberOfChildren) return !1
                for (const r in n.children) {
                  if (!e.children[r]) return !1
                  if (!t(e.children[r], n.children[r])) return !1
                }
                return !0
              })(t.root, e.root)
          : (function (t, e) {
              return (
                Object.keys(e).length <= Object.keys(t).length &&
                Object.keys(e).every(n => od(t[n], e[n]))
              )
            })(t.queryParams, e.queryParams) &&
              (function t (e, n) {
                return (function e (n, r, s) {
                  if (n.segments.length > s.length)
                    return (
                      !!gd(n.segments.slice(0, s.length), s) && !r.hasChildren()
                    )
                  if (n.segments.length === s.length) {
                    if (!gd(n.segments, s)) return !1
                    for (const e in r.children) {
                      if (!n.children[e]) return !1
                      if (!t(n.children[e], r.children[e])) return !1
                    }
                    return !0
                  }
                  {
                    const t = s.slice(0, n.segments.length),
                      i = s.slice(n.segments.length)
                    return (
                      !!gd(n.segments, t) &&
                      !!n.children.primary &&
                      e(n.children.primary, r, i)
                    )
                  }
                })(e, n, n.segments)
              })(t.root, e.root)
      }
      class dd {
        constructor (t, e, n) {
          ;(this.root = t), (this.queryParams = e), (this.fragment = n)
        }
        get queryParamMap () {
          return (
            this._queryParamMap || (this._queryParamMap = Kh(this.queryParams)),
            this._queryParamMap
          )
        }
        toString () {
          return _d.serialize(this)
        }
      }
      class pd {
        constructor (t, e) {
          ;(this.segments = t),
            (this.children = e),
            (this.parent = null),
            ud(e, (t, e) => (t.parent = this))
        }
        hasChildren () {
          return this.numberOfChildren > 0
        }
        get numberOfChildren () {
          return Object.keys(this.children).length
        }
        toString () {
          return wd(this)
        }
      }
      class fd {
        constructor (t, e) {
          ;(this.path = t), (this.parameters = e)
        }
        get parameterMap () {
          return (
            this._parameterMap || (this._parameterMap = Kh(this.parameters)),
            this._parameterMap
          )
        }
        toString () {
          return Td(this)
        }
      }
      function gd (t, e) {
        return t.length === e.length && t.every((t, n) => t.path === e[n].path)
      }
      function md (t, e) {
        let n = []
        return (
          ud(t.children, (t, r) => {
            'primary' === r && (n = n.concat(e(t, r)))
          }),
          ud(t.children, (t, r) => {
            'primary' !== r && (n = n.concat(e(t, r)))
          }),
          n
        )
      }
      class yd {}
      class vd {
        parse (t) {
          const e = new Md(t)
          return new dd(
            e.parseRootSegment(),
            e.parseQueryParams(),
            e.parseFragment()
          )
        }
        serialize (t) {
          var e
          return `${`/${(function t (e, n) {
            if (!e.hasChildren()) return wd(e)
            if (n) {
              const n = e.children.primary ? t(e.children.primary, !1) : '',
                r = []
              return (
                ud(e.children, (e, n) => {
                  'primary' !== n && r.push(`${n}:${t(e, !1)}`)
                }),
                r.length > 0 ? `${n}(${r.join('//')})` : n
              )
            }
            {
              const n = md(e, (n, r) =>
                'primary' === r
                  ? [t(e.children.primary, !1)]
                  : [`${r}:${t(n, !1)}`]
              )
              return `${wd(e)}/(${n.join('//')})`
            }
          })(t.root, !0)}`}${(function (t) {
            const e = Object.keys(t).map(e => {
              const n = t[e]
              return Array.isArray(n)
                ? n.map(t => `${Cd(e)}=${Cd(t)}`).join('&')
                : `${Cd(e)}=${Cd(n)}`
            })
            return e.length ? `?${e.join('&')}` : ''
          })(t.queryParams)}${
            'string' == typeof t.fragment
              ? `#${((e = t.fragment), encodeURI(e))}`
              : ''
          }`
        }
      }
      const _d = new vd()
      function wd (t) {
        return t.segments.map(t => Td(t)).join('/')
      }
      function bd (t) {
        return encodeURIComponent(t)
          .replace(/%40/g, '@')
          .replace(/%3A/gi, ':')
          .replace(/%24/g, '$')
          .replace(/%2C/gi, ',')
      }
      function Cd (t) {
        return bd(t).replace(/%3B/gi, ';')
      }
      function Sd (t) {
        return bd(t)
          .replace(/\(/g, '%28')
          .replace(/\)/g, '%29')
          .replace(/%26/gi, '&')
      }
      function xd (t) {
        return decodeURIComponent(t)
      }
      function Ed (t) {
        return xd(t.replace(/\+/g, '%20'))
      }
      function Td (t) {
        return `${Sd(t.path)}${
          ((e = t.parameters),
          Object.keys(e)
            .map(t => `;${Sd(t)}=${Sd(e[t])}`)
            .join(''))
        }`
        var e
      }
      const kd = /^[^\/()?;=#]+/
      function Ad (t) {
        const e = t.match(kd)
        return e ? e[0] : ''
      }
      const Od = /^[^=?&#]+/,
        Id = /^[^?&#]+/
      class Md {
        constructor (t) {
          ;(this.url = t), (this.remaining = t)
        }
        parseRootSegment () {
          return (
            this.consumeOptional('/'),
            '' === this.remaining ||
            this.peekStartsWith('?') ||
            this.peekStartsWith('#')
              ? new pd([], {})
              : new pd([], this.parseChildren())
          )
        }
        parseQueryParams () {
          const t = {}
          if (this.consumeOptional('?'))
            do {
              this.parseQueryParam(t)
            } while (this.consumeOptional('&'))
          return t
        }
        parseFragment () {
          return this.consumeOptional('#')
            ? decodeURIComponent(this.remaining)
            : null
        }
        parseChildren () {
          if ('' === this.remaining) return {}
          this.consumeOptional('/')
          const t = []
          for (
            this.peekStartsWith('(') || t.push(this.parseSegment());
            this.peekStartsWith('/') &&
            !this.peekStartsWith('//') &&
            !this.peekStartsWith('/(');

          )
            this.capture('/'), t.push(this.parseSegment())
          let e = {}
          this.peekStartsWith('/(') &&
            (this.capture('/'), (e = this.parseParens(!0)))
          let n = {}
          return (
            this.peekStartsWith('(') && (n = this.parseParens(!1)),
            (t.length > 0 || Object.keys(e).length > 0) &&
              (n.primary = new pd(t, e)),
            n
          )
        }
        parseSegment () {
          const t = Ad(this.remaining)
          if ('' === t && this.peekStartsWith(';'))
            throw new Error(
              `Empty path url segment cannot have parameters: '${this.remaining}'.`
            )
          return this.capture(t), new fd(xd(t), this.parseMatrixParams())
        }
        parseMatrixParams () {
          const t = {}
          for (; this.consumeOptional(';'); ) this.parseParam(t)
          return t
        }
        parseParam (t) {
          const e = Ad(this.remaining)
          if (!e) return
          this.capture(e)
          let n = ''
          if (this.consumeOptional('=')) {
            const t = Ad(this.remaining)
            t && ((n = t), this.capture(n))
          }
          t[xd(e)] = xd(n)
        }
        parseQueryParam (t) {
          const e = (function (t) {
            const e = t.match(Od)
            return e ? e[0] : ''
          })(this.remaining)
          if (!e) return
          this.capture(e)
          let n = ''
          if (this.consumeOptional('=')) {
            const t = (function (t) {
              const e = t.match(Id)
              return e ? e[0] : ''
            })(this.remaining)
            t && ((n = t), this.capture(n))
          }
          const r = Ed(e),
            s = Ed(n)
          if (t.hasOwnProperty(r)) {
            let e = t[r]
            Array.isArray(e) || ((e = [e]), (t[r] = e)), e.push(s)
          } else t[r] = s
        }
        parseParens (t) {
          const e = {}
          for (
            this.capture('(');
            !this.consumeOptional(')') && this.remaining.length > 0;

          ) {
            const n = Ad(this.remaining),
              r = this.remaining[n.length]
            if ('/' !== r && ')' !== r && ';' !== r)
              throw new Error(`Cannot parse url '${this.url}'`)
            let s = void 0
            n.indexOf(':') > -1
              ? ((s = n.substr(0, n.indexOf(':'))),
                this.capture(s),
                this.capture(':'))
              : t && (s = 'primary')
            const i = this.parseChildren()
            ;(e[s] = 1 === Object.keys(i).length ? i.primary : new pd([], i)),
              this.consumeOptional('//')
          }
          return e
        }
        peekStartsWith (t) {
          return this.remaining.startsWith(t)
        }
        consumeOptional (t) {
          return (
            !!this.peekStartsWith(t) &&
            ((this.remaining = this.remaining.substring(t.length)), !0)
          )
        }
        capture (t) {
          if (!this.consumeOptional(t)) throw new Error(`Expected "${t}".`)
        }
      }
      class Pd {
        constructor (t) {
          this._root = t
        }
        get root () {
          return this._root.value
        }
        parent (t) {
          const e = this.pathFromRoot(t)
          return e.length > 1 ? e[e.length - 2] : null
        }
        children (t) {
          const e = Rd(t, this._root)
          return e ? e.children.map(t => t.value) : []
        }
        firstChild (t) {
          const e = Rd(t, this._root)
          return e && e.children.length > 0 ? e.children[0].value : null
        }
        siblings (t) {
          const e = Nd(t, this._root)
          return e.length < 2
            ? []
            : e[e.length - 2].children.map(t => t.value).filter(e => e !== t)
        }
        pathFromRoot (t) {
          return Nd(t, this._root).map(t => t.value)
        }
      }
      function Rd (t, e) {
        if (t === e.value) return e
        for (const n of e.children) {
          const e = Rd(t, n)
          if (e) return e
        }
        return null
      }
      function Nd (t, e) {
        if (t === e.value) return [e]
        for (const n of e.children) {
          const r = Nd(t, n)
          if (r.length) return r.unshift(e), r
        }
        return []
      }
      class Dd {
        constructor (t, e) {
          ;(this.value = t), (this.children = e)
        }
        toString () {
          return `TreeNode(${this.value})`
        }
      }
      function Vd (t) {
        const e = {}
        return t && t.children.forEach(t => (e[t.value.outlet] = t)), e
      }
      class jd extends Pd {
        constructor (t, e) {
          super(t), (this.snapshot = e), Gd(this, t)
        }
        toString () {
          return this.snapshot.toString()
        }
      }
      function Fd (t, e) {
        const n = (function (t, e) {
            const n = new $d(
              [],
              {},
              {},
              '',
              {},
              'primary',
              e,
              null,
              t.root,
              -1,
              {}
            )
            return new Hd('', new Dd(n, []))
          })(t, e),
          r = new Uc([new fd('', {})]),
          s = new Uc({}),
          i = new Uc({}),
          o = new Uc({}),
          a = new Uc(''),
          l = new Ud(r, s, o, a, i, 'primary', e, n.root)
        return (l.snapshot = n.root), new jd(new Dd(l, []), n)
      }
      class Ud {
        constructor (t, e, n, r, s, i, o, a) {
          ;(this.url = t),
            (this.params = e),
            (this.queryParams = n),
            (this.fragment = r),
            (this.data = s),
            (this.outlet = i),
            (this.component = o),
            (this._futureSnapshot = a)
        }
        get routeConfig () {
          return this._futureSnapshot.routeConfig
        }
        get root () {
          return this._routerState.root
        }
        get parent () {
          return this._routerState.parent(this)
        }
        get firstChild () {
          return this._routerState.firstChild(this)
        }
        get children () {
          return this._routerState.children(this)
        }
        get pathFromRoot () {
          return this._routerState.pathFromRoot(this)
        }
        get paramMap () {
          return (
            this._paramMap ||
              (this._paramMap = this.params.pipe(j(t => Kh(t)))),
            this._paramMap
          )
        }
        get queryParamMap () {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe(j(t => Kh(t)))),
            this._queryParamMap
          )
        }
        toString () {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`
        }
      }
      function Ld (t, e = 'emptyOnly') {
        const n = t.pathFromRoot
        let r = 0
        if ('always' !== e)
          for (r = n.length - 1; r >= 1; ) {
            const t = n[r],
              e = n[r - 1]
            if (t.routeConfig && '' === t.routeConfig.path) r--
            else {
              if (e.component) break
              r--
            }
          }
        return (function (t) {
          return t.reduce(
            (t, e) => ({
              params: Object.assign(Object.assign({}, t.params), e.params),
              data: Object.assign(Object.assign({}, t.data), e.data),
              resolve: Object.assign(
                Object.assign({}, t.resolve),
                e._resolvedData
              )
            }),
            { params: {}, data: {}, resolve: {} }
          )
        })(n.slice(r))
      }
      class $d {
        constructor (t, e, n, r, s, i, o, a, l, u, c) {
          ;(this.url = t),
            (this.params = e),
            (this.queryParams = n),
            (this.fragment = r),
            (this.data = s),
            (this.outlet = i),
            (this.component = o),
            (this.routeConfig = a),
            (this._urlSegment = l),
            (this._lastPathIndex = u),
            (this._resolve = c)
        }
        get root () {
          return this._routerState.root
        }
        get parent () {
          return this._routerState.parent(this)
        }
        get firstChild () {
          return this._routerState.firstChild(this)
        }
        get children () {
          return this._routerState.children(this)
        }
        get pathFromRoot () {
          return this._routerState.pathFromRoot(this)
        }
        get paramMap () {
          return (
            this._paramMap || (this._paramMap = Kh(this.params)), this._paramMap
          )
        }
        get queryParamMap () {
          return (
            this._queryParamMap || (this._queryParamMap = Kh(this.queryParams)),
            this._queryParamMap
          )
        }
        toString () {
          return `Route(url:'${this.url
            .map(t => t.toString())
            .join('/')}', path:'${
            this.routeConfig ? this.routeConfig.path : ''
          }')`
        }
      }
      class Hd extends Pd {
        constructor (t, e) {
          super(e), (this.url = t), Gd(this, e)
        }
        toString () {
          return zd(this._root)
        }
      }
      function Gd (t, e) {
        ;(e.value._routerState = t), e.children.forEach(e => Gd(t, e))
      }
      function zd (t) {
        const e =
          t.children.length > 0 ? ` { ${t.children.map(zd).join(', ')} } ` : ''
        return `${t.value}${e}`
      }
      function qd (t) {
        if (t.snapshot) {
          const e = t.snapshot,
            n = t._futureSnapshot
          ;(t.snapshot = n),
            id(e.queryParams, n.queryParams) ||
              t.queryParams.next(n.queryParams),
            e.fragment !== n.fragment && t.fragment.next(n.fragment),
            id(e.params, n.params) || t.params.next(n.params),
            (function (t, e) {
              if (t.length !== e.length) return !1
              for (let n = 0; n < t.length; ++n) if (!id(t[n], e[n])) return !1
              return !0
            })(e.url, n.url) || t.url.next(n.url),
            id(e.data, n.data) || t.data.next(n.data)
        } else
          (t.snapshot = t._futureSnapshot), t.data.next(t._futureSnapshot.data)
      }
      function Bd (t, e) {
        var n, r
        return (
          id(t.params, e.params) &&
          gd((n = t.url), (r = e.url)) &&
          n.every((t, e) => id(t.parameters, r[e].parameters)) &&
          !(!t.parent != !e.parent) &&
          (!t.parent || Bd(t.parent, e.parent))
        )
      }
      function Wd (t) {
        return 'object' == typeof t && null != t && !t.outlets && !t.segmentPath
      }
      function Zd (t, e, n, r, s) {
        let i = {}
        return (
          r &&
            ud(r, (t, e) => {
              i[e] = Array.isArray(t) ? t.map(t => `${t}`) : `${t}`
            }),
          new dd(
            n.root === t
              ? e
              : (function t (e, n, r) {
                  const s = {}
                  return (
                    ud(e.children, (e, i) => {
                      s[i] = e === n ? r : t(e, n, r)
                    }),
                    new pd(e.segments, s)
                  )
                })(n.root, t, e),
            i,
            s
          )
        )
      }
      class Qd {
        constructor (t, e, n) {
          if (
            ((this.isAbsolute = t),
            (this.numberOfDoubleDots = e),
            (this.commands = n),
            t && n.length > 0 && Wd(n[0]))
          )
            throw new Error('Root segment cannot have matrix parameters')
          const r = n.find(t => 'object' == typeof t && null != t && t.outlets)
          if (r && r !== ld(n))
            throw new Error('{outlets:{}} has to be the last command')
        }
        toRoot () {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            '/' == this.commands[0]
          )
        }
      }
      class Jd {
        constructor (t, e, n) {
          ;(this.segmentGroup = t), (this.processChildren = e), (this.index = n)
        }
      }
      function Kd (t) {
        return 'object' == typeof t && null != t && t.outlets
          ? t.outlets.primary
          : `${t}`
      }
      function Yd (t, e, n) {
        if (
          (t || (t = new pd([], {})),
          0 === t.segments.length && t.hasChildren())
        )
          return Xd(t, e, n)
        const r = (function (t, e, n) {
            let r = 0,
              s = e
            const i = { match: !1, pathIndex: 0, commandIndex: 0 }
            for (; s < t.segments.length; ) {
              if (r >= n.length) return i
              const e = t.segments[s],
                o = Kd(n[r]),
                a = r < n.length - 1 ? n[r + 1] : null
              if (s > 0 && void 0 === o) break
              if (o && a && 'object' == typeof a && void 0 === a.outlets) {
                if (!rp(o, a, e)) return i
                r += 2
              } else {
                if (!rp(o, {}, e)) return i
                r++
              }
              s++
            }
            return { match: !0, pathIndex: s, commandIndex: r }
          })(t, e, n),
          s = n.slice(r.commandIndex)
        if (r.match && r.pathIndex < t.segments.length) {
          const e = new pd(t.segments.slice(0, r.pathIndex), {})
          return (
            (e.children.primary = new pd(
              t.segments.slice(r.pathIndex),
              t.children
            )),
            Xd(e, 0, s)
          )
        }
        return r.match && 0 === s.length
          ? new pd(t.segments, {})
          : r.match && !t.hasChildren()
          ? tp(t, e, n)
          : r.match
          ? Xd(t, 0, s)
          : tp(t, e, n)
      }
      function Xd (t, e, n) {
        if (0 === n.length) return new pd(t.segments, {})
        {
          const r = (function (t) {
              return 'object' != typeof t[0]
                ? { primary: t }
                : void 0 === t[0].outlets
                ? { primary: t }
                : t[0].outlets
            })(n),
            s = {}
          return (
            ud(r, (n, r) => {
              null !== n && (s[r] = Yd(t.children[r], e, n))
            }),
            ud(t.children, (t, e) => {
              void 0 === r[e] && (s[e] = t)
            }),
            new pd(t.segments, s)
          )
        }
      }
      function tp (t, e, n) {
        const r = t.segments.slice(0, e)
        let s = 0
        for (; s < n.length; ) {
          if ('object' == typeof n[s] && void 0 !== n[s].outlets) {
            const t = ep(n[s].outlets)
            return new pd(r, t)
          }
          if (0 === s && Wd(n[0])) {
            r.push(new fd(t.segments[e].path, n[0])), s++
            continue
          }
          const i = Kd(n[s]),
            o = s < n.length - 1 ? n[s + 1] : null
          i && o && Wd(o)
            ? (r.push(new fd(i, np(o))), (s += 2))
            : (r.push(new fd(i, {})), s++)
        }
        return new pd(r, {})
      }
      function ep (t) {
        const e = {}
        return (
          ud(t, (t, n) => {
            null !== t && (e[n] = tp(new pd([], {}), 0, t))
          }),
          e
        )
      }
      function np (t) {
        const e = {}
        return ud(t, (t, n) => (e[n] = `${t}`)), e
      }
      function rp (t, e, n) {
        return t == n.path && id(e, n.parameters)
      }
      class sp {
        constructor (t, e, n, r) {
          ;(this.routeReuseStrategy = t),
            (this.futureState = e),
            (this.currState = n),
            (this.forwardEvent = r)
        }
        activate (t) {
          const e = this.futureState._root,
            n = this.currState ? this.currState._root : null
          this.deactivateChildRoutes(e, n, t),
            qd(this.futureState.root),
            this.activateChildRoutes(e, n, t)
        }
        deactivateChildRoutes (t, e, n) {
          const r = Vd(e)
          t.children.forEach(t => {
            const e = t.value.outlet
            this.deactivateRoutes(t, r[e], n), delete r[e]
          }),
            ud(r, (t, e) => {
              this.deactivateRouteAndItsChildren(t, n)
            })
        }
        deactivateRoutes (t, e, n) {
          const r = t.value,
            s = e ? e.value : null
          if (r === s)
            if (r.component) {
              const s = n.getContext(r.outlet)
              s && this.deactivateChildRoutes(t, e, s.children)
            } else this.deactivateChildRoutes(t, e, n)
          else s && this.deactivateRouteAndItsChildren(e, n)
        }
        deactivateRouteAndItsChildren (t, e) {
          this.routeReuseStrategy.shouldDetach(t.value.snapshot)
            ? this.detachAndStoreRouteSubtree(t, e)
            : this.deactivateRouteAndOutlet(t, e)
        }
        detachAndStoreRouteSubtree (t, e) {
          const n = e.getContext(t.value.outlet)
          if (n && n.outlet) {
            const e = n.outlet.detach(),
              r = n.children.onOutletDeactivated()
            this.routeReuseStrategy.store(t.value.snapshot, {
              componentRef: e,
              route: t,
              contexts: r
            })
          }
        }
        deactivateRouteAndOutlet (t, e) {
          const n = e.getContext(t.value.outlet)
          if (n) {
            const r = Vd(t),
              s = t.value.component ? n.children : e
            ud(r, (t, e) => this.deactivateRouteAndItsChildren(t, s)),
              n.outlet &&
                (n.outlet.deactivate(), n.children.onOutletDeactivated())
          }
        }
        activateChildRoutes (t, e, n) {
          const r = Vd(e)
          t.children.forEach(t => {
            this.activateRoutes(t, r[t.value.outlet], n),
              this.forwardEvent(new Wh(t.value.snapshot))
          }),
            t.children.length && this.forwardEvent(new qh(t.value.snapshot))
        }
        activateRoutes (t, e, n) {
          const r = t.value,
            s = e ? e.value : null
          if ((qd(r), r === s))
            if (r.component) {
              const s = n.getOrCreateContext(r.outlet)
              this.activateChildRoutes(t, e, s.children)
            } else this.activateChildRoutes(t, e, n)
          else if (r.component) {
            const e = n.getOrCreateContext(r.outlet)
            if (this.routeReuseStrategy.shouldAttach(r.snapshot)) {
              const t = this.routeReuseStrategy.retrieve(r.snapshot)
              this.routeReuseStrategy.store(r.snapshot, null),
                e.children.onOutletReAttached(t.contexts),
                (e.attachRef = t.componentRef),
                (e.route = t.route.value),
                e.outlet && e.outlet.attach(t.componentRef, t.route.value),
                ip(t.route)
            } else {
              const n = (function (t) {
                  for (let e = t.parent; e; e = e.parent) {
                    const t = e.routeConfig
                    if (t && t._loadedConfig) return t._loadedConfig
                    if (t && t.component) return null
                  }
                  return null
                })(r.snapshot),
                s = n ? n.module.componentFactoryResolver : null
              ;(e.attachRef = null),
                (e.route = r),
                (e.resolver = s),
                e.outlet && e.outlet.activateWith(r, s),
                this.activateChildRoutes(t, null, e.children)
            }
          } else this.activateChildRoutes(t, null, n)
        }
      }
      function ip (t) {
        qd(t.value), t.children.forEach(ip)
      }
      function op (t) {
        return 'function' == typeof t
      }
      function ap (t) {
        return t instanceof dd
      }
      class lp {
        constructor (t) {
          this.segmentGroup = t || null
        }
      }
      class up {
        constructor (t) {
          this.urlTree = t
        }
      }
      function cp (t) {
        return new w(e => e.error(new lp(t)))
      }
      function hp (t) {
        return new w(e => e.error(new up(t)))
      }
      function dp (t) {
        return new w(e =>
          e.error(
            new Error(
              `Only absolute redirects can have named outlets. redirectTo: '${t}'`
            )
          )
        )
      }
      class pp {
        constructor (t, e, n, r, s) {
          ;(this.configLoader = e),
            (this.urlSerializer = n),
            (this.urlTree = r),
            (this.config = s),
            (this.allowRedirects = !0),
            (this.ngModule = t.get(Kt))
        }
        apply () {
          return this.expandSegmentGroup(
            this.ngModule,
            this.config,
            this.urlTree.root,
            'primary'
          )
            .pipe(
              j(t =>
                this.createUrlTree(
                  t,
                  this.urlTree.queryParams,
                  this.urlTree.fragment
                )
              )
            )
            .pipe(
              uh(t => {
                if (t instanceof up)
                  return (this.allowRedirects = !1), this.match(t.urlTree)
                if (t instanceof lp) throw this.noMatchError(t)
                throw t
              })
            )
        }
        match (t) {
          return this.expandSegmentGroup(
            this.ngModule,
            this.config,
            t.root,
            'primary'
          )
            .pipe(j(e => this.createUrlTree(e, t.queryParams, t.fragment)))
            .pipe(
              uh(t => {
                if (t instanceof lp) throw this.noMatchError(t)
                throw t
              })
            )
        }
        noMatchError (t) {
          return new Error(
            `Cannot match any routes. URL Segment: '${t.segmentGroup}'`
          )
        }
        createUrlTree (t, e, n) {
          const r = t.segments.length > 0 ? new pd([], { primary: t }) : t
          return new dd(r, e, n)
        }
        expandSegmentGroup (t, e, n, r) {
          return 0 === n.segments.length && n.hasChildren()
            ? this.expandChildren(t, e, n).pipe(j(t => new pd([], t)))
            : this.expandSegment(t, n, e, n.segments, r, !0)
        }
        expandChildren (t, e, n) {
          return (function (t, e) {
            if (0 === Object.keys(t).length) return Fc({})
            const n = [],
              r = [],
              s = {}
            return (
              ud(t, (t, i) => {
                const o = e(i, t).pipe(j(t => (s[i] = t)))
                'primary' === i ? n.push(o) : r.push(o)
              }),
              Fc.apply(null, n.concat(r)).pipe(
                Wc(),
                lh(),
                j(() => s)
              )
            )
          })(n.children, (n, r) => this.expandSegmentGroup(t, e, r, n))
        }
        expandSegment (t, e, n, r, s, i) {
          return Fc(...n).pipe(
            j(o =>
              this.expandSegmentAgainstRoute(t, e, n, o, r, s, i).pipe(
                uh(t => {
                  if (t instanceof lp) return Fc(null)
                  throw t
                })
              )
            ),
            Wc(),
            gh(t => !!t),
            uh((t, n) => {
              if (t instanceof Lc || 'EmptyError' === t.name) {
                if (this.noLeftoversInUrl(e, r, s)) return Fc(new pd([], {}))
                throw new lp(e)
              }
              throw t
            })
          )
        }
        noLeftoversInUrl (t, e, n) {
          return 0 === e.length && !t.children[n]
        }
        expandSegmentAgainstRoute (t, e, n, r, s, i, o) {
          return yp(r) !== i
            ? cp(e)
            : void 0 === r.redirectTo
            ? this.matchSegmentAgainstRoute(t, e, r, s)
            : o && this.allowRedirects
            ? this.expandSegmentAgainstRouteUsingRedirect(t, e, n, r, s, i)
            : cp(e)
        }
        expandSegmentAgainstRouteUsingRedirect (t, e, n, r, s, i) {
          return '**' === r.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(t, n, r, i)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                t,
                e,
                n,
                r,
                s,
                i
              )
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect (t, e, n, r) {
          const s = this.applyRedirectCommands([], n.redirectTo, {})
          return n.redirectTo.startsWith('/')
            ? hp(s)
            : this.lineralizeSegments(n, s).pipe(
                H(n => {
                  const s = new pd(n, {})
                  return this.expandSegment(t, s, e, n, r, !1)
                })
              )
        }
        expandRegularSegmentAgainstRouteUsingRedirect (t, e, n, r, s, i) {
          const {
            matched: o,
            consumedSegments: a,
            lastChild: l,
            positionalParamSegments: u
          } = fp(e, r, s)
          if (!o) return cp(e)
          const c = this.applyRedirectCommands(a, r.redirectTo, u)
          return r.redirectTo.startsWith('/')
            ? hp(c)
            : this.lineralizeSegments(r, c).pipe(
                H(r => this.expandSegment(t, e, n, r.concat(s.slice(l)), i, !1))
              )
        }
        matchSegmentAgainstRoute (t, e, n, r) {
          if ('**' === n.path)
            return n.loadChildren
              ? this.configLoader
                  .load(t.injector, n)
                  .pipe(j(t => ((n._loadedConfig = t), new pd(r, {}))))
              : Fc(new pd(r, {}))
          const { matched: s, consumedSegments: i, lastChild: o } = fp(e, n, r)
          if (!s) return cp(e)
          const a = r.slice(o)
          return this.getChildConfig(t, n, r).pipe(
            H(t => {
              const n = t.module,
                r = t.routes,
                { segmentGroup: s, slicedSegments: o } = (function (
                  t,
                  e,
                  n,
                  r
                ) {
                  return n.length > 0 &&
                    (function (t, e, n) {
                      return n.some(n => mp(t, e, n) && 'primary' !== yp(n))
                    })(t, n, r)
                    ? {
                        segmentGroup: gp(
                          new pd(
                            e,
                            (function (t, e) {
                              const n = {}
                              n.primary = e
                              for (const r of t)
                                '' === r.path &&
                                  'primary' !== yp(r) &&
                                  (n[yp(r)] = new pd([], {}))
                              return n
                            })(r, new pd(n, t.children))
                          )
                        ),
                        slicedSegments: []
                      }
                    : 0 === n.length &&
                      (function (t, e, n) {
                        return n.some(n => mp(t, e, n))
                      })(t, n, r)
                    ? {
                        segmentGroup: gp(
                          new pd(
                            t.segments,
                            (function (t, e, n, r) {
                              const s = {}
                              for (const i of n)
                                mp(t, e, i) &&
                                  !r[yp(i)] &&
                                  (s[yp(i)] = new pd([], {}))
                              return Object.assign(Object.assign({}, r), s)
                            })(t, n, r, t.children)
                          )
                        ),
                        slicedSegments: n
                      }
                    : { segmentGroup: t, slicedSegments: n }
                })(e, i, a, r)
              return 0 === o.length && s.hasChildren()
                ? this.expandChildren(n, r, s).pipe(j(t => new pd(i, t)))
                : 0 === r.length && 0 === o.length
                ? Fc(new pd(i, {}))
                : this.expandSegment(n, s, r, o, 'primary', !0).pipe(
                    j(t => new pd(i.concat(t.segments), t.children))
                  )
            })
          )
        }
        getChildConfig (t, e, n) {
          return e.children
            ? Fc(new td(e.children, t))
            : e.loadChildren
            ? void 0 !== e._loadedConfig
              ? Fc(e._loadedConfig)
              : (function (t, e, n) {
                  const r = e.canLoad
                  return r && 0 !== r.length
                    ? $(r)
                        .pipe(
                          j(r => {
                            const s = t.get(r)
                            let i
                            if (
                              (function (t) {
                                return t && op(t.canLoad)
                              })(s)
                            )
                              i = s.canLoad(e, n)
                            else {
                              if (!op(s))
                                throw new Error('Invalid CanLoad guard')
                              i = s(e, n)
                            }
                            return cd(i)
                          })
                        )
                        .pipe(
                          Wc(),
                          ((s = t => !0 === t),
                          t => t.lift(new mh(s, void 0, t)))
                        )
                    : Fc(!0)
                  var s
                })(t.injector, e, n).pipe(
                  H(n =>
                    n
                      ? this.configLoader
                          .load(t.injector, e)
                          .pipe(j(t => ((e._loadedConfig = t), t)))
                      : (function (t) {
                          return new w(e =>
                            e.error(
                              Yh(
                                `Cannot load children because the guard of the route "path: '${t.path}'" returned false`
                              )
                            )
                          )
                        })(e)
                  )
                )
            : Fc(new td([], t))
        }
        lineralizeSegments (t, e) {
          let n = [],
            r = e.root
          for (;;) {
            if (((n = n.concat(r.segments)), 0 === r.numberOfChildren))
              return Fc(n)
            if (r.numberOfChildren > 1 || !r.children.primary)
              return dp(t.redirectTo)
            r = r.children.primary
          }
        }
        applyRedirectCommands (t, e, n) {
          return this.applyRedirectCreatreUrlTree(
            e,
            this.urlSerializer.parse(e),
            t,
            n
          )
        }
        applyRedirectCreatreUrlTree (t, e, n, r) {
          const s = this.createSegmentGroup(t, e.root, n, r)
          return new dd(
            s,
            this.createQueryParams(e.queryParams, this.urlTree.queryParams),
            e.fragment
          )
        }
        createQueryParams (t, e) {
          const n = {}
          return (
            ud(t, (t, r) => {
              if ('string' == typeof t && t.startsWith(':')) {
                const s = t.substring(1)
                n[r] = e[s]
              } else n[r] = t
            }),
            n
          )
        }
        createSegmentGroup (t, e, n, r) {
          const s = this.createSegments(t, e.segments, n, r)
          let i = {}
          return (
            ud(e.children, (e, s) => {
              i[s] = this.createSegmentGroup(t, e, n, r)
            }),
            new pd(s, i)
          )
        }
        createSegments (t, e, n, r) {
          return e.map(e =>
            e.path.startsWith(':')
              ? this.findPosParam(t, e, r)
              : this.findOrReturn(e, n)
          )
        }
        findPosParam (t, e, n) {
          const r = n[e.path.substring(1)]
          if (!r)
            throw new Error(
              `Cannot redirect to '${t}'. Cannot find '${e.path}'.`
            )
          return r
        }
        findOrReturn (t, e) {
          let n = 0
          for (const r of e) {
            if (r.path === t.path) return e.splice(n), r
            n++
          }
          return t
        }
      }
      function fp (t, e, n) {
        if ('' === e.path)
          return 'full' === e.pathMatch && (t.hasChildren() || n.length > 0)
            ? {
                matched: !1,
                consumedSegments: [],
                lastChild: 0,
                positionalParamSegments: {}
              }
            : {
                matched: !0,
                consumedSegments: [],
                lastChild: 0,
                positionalParamSegments: {}
              }
        const r = (e.matcher || Xh)(n, t, e)
        return r
          ? {
              matched: !0,
              consumedSegments: r.consumed,
              lastChild: r.consumed.length,
              positionalParamSegments: r.posParams
            }
          : {
              matched: !1,
              consumedSegments: [],
              lastChild: 0,
              positionalParamSegments: {}
            }
      }
      function gp (t) {
        if (1 === t.numberOfChildren && t.children.primary) {
          const e = t.children.primary
          return new pd(t.segments.concat(e.segments), e.children)
        }
        return t
      }
      function mp (t, e, n) {
        return (
          (!(t.hasChildren() || e.length > 0) || 'full' !== n.pathMatch) &&
          '' === n.path &&
          void 0 !== n.redirectTo
        )
      }
      function yp (t) {
        return t.outlet || 'primary'
      }
      class vp {
        constructor (t) {
          ;(this.path = t), (this.route = this.path[this.path.length - 1])
        }
      }
      class _p {
        constructor (t, e) {
          ;(this.component = t), (this.route = e)
        }
      }
      function wp (t, e, n) {
        const r = t._root
        return (function t (
          e,
          n,
          r,
          s,
          i = { canDeactivateChecks: [], canActivateChecks: [] }
        ) {
          const o = Vd(n)
          return (
            e.children.forEach(e => {
              !(function (
                e,
                n,
                r,
                s,
                i = { canDeactivateChecks: [], canActivateChecks: [] }
              ) {
                const o = e.value,
                  a = n ? n.value : null,
                  l = r ? r.getContext(e.value.outlet) : null
                if (a && o.routeConfig === a.routeConfig) {
                  const u = (function (t, e, n) {
                    if ('function' == typeof n) return n(t, e)
                    switch (n) {
                      case 'pathParamsChange':
                        return !gd(t.url, e.url)
                      case 'pathParamsOrQueryParamsChange':
                        return (
                          !gd(t.url, e.url) || !id(t.queryParams, e.queryParams)
                        )
                      case 'always':
                        return !0
                      case 'paramsOrQueryParamsChange':
                        return !Bd(t, e) || !id(t.queryParams, e.queryParams)
                      case 'paramsChange':
                      default:
                        return !Bd(t, e)
                    }
                  })(a, o, o.routeConfig.runGuardsAndResolvers)
                  u
                    ? i.canActivateChecks.push(new vp(s))
                    : ((o.data = a.data), (o._resolvedData = a._resolvedData)),
                    t(e, n, o.component ? (l ? l.children : null) : r, s, i),
                    u &&
                      i.canDeactivateChecks.push(
                        new _p((l && l.outlet && l.outlet.component) || null, a)
                      )
                } else
                  a && Cp(n, l, i),
                    i.canActivateChecks.push(new vp(s)),
                    t(e, null, o.component ? (l ? l.children : null) : r, s, i)
              })(e, o[e.value.outlet], r, s.concat([e.value]), i),
                delete o[e.value.outlet]
            }),
            ud(o, (t, e) => Cp(t, r.getContext(e), i)),
            i
          )
        })(r, e ? e._root : null, n, [r.value])
      }
      function bp (t, e, n) {
        const r = (function (t) {
          if (!t) return null
          for (let e = t.parent; e; e = e.parent) {
            const t = e.routeConfig
            if (t && t._loadedConfig) return t._loadedConfig
          }
          return null
        })(e)
        return (r ? r.module.injector : n).get(t)
      }
      function Cp (t, e, n) {
        const r = Vd(t),
          s = t.value
        ud(r, (t, r) => {
          Cp(t, s.component ? (e ? e.children.getContext(r) : null) : e, n)
        }),
          n.canDeactivateChecks.push(
            new _p(
              s.component && e && e.outlet && e.outlet.isActivated
                ? e.outlet.component
                : null,
              s
            )
          )
      }
      const Sp = Symbol('INITIAL_VALUE')
      function xp () {
        return vh(t =>
          (function (...t) {
            let e = null,
              n = null
            return (
              k(t[t.length - 1]) && (n = t.pop()),
              'function' == typeof t[t.length - 1] && (e = t.pop()),
              1 === t.length && l(t[0]) && (t = t[0]),
              B(t, n).lift(new Hc(e))
            )
          })(
            ...t.map(t =>
              t.pipe(
                dh(1),
                (function (...t) {
                  const e = t[t.length - 1]
                  return k(e) ? (t.pop(), n => bh(t, n, e)) : e => bh(t, e)
                })(Sp)
              )
            )
          ).pipe(
            Ch((t, e) => {
              let n = !1
              return e.reduce((t, r, s) => {
                if (t !== Sp) return t
                if ((r === Sp && (n = !0), !n)) {
                  if (!1 === r) return r
                  if (s === e.length - 1 || ap(r)) return r
                }
                return t
              }, t)
            }, Sp),
            Zc(t => t !== Sp),
            j(t => (ap(t) ? t : !0 === t)),
            dh(1)
          )
        )
      }
      function Ep (t, e) {
        return null !== t && e && e(new Bh(t)), Fc(!0)
      }
      function Tp (t, e) {
        return null !== t && e && e(new zh(t)), Fc(!0)
      }
      function kp (t, e, n) {
        const r = e.routeConfig ? e.routeConfig.canActivate : null
        return r && 0 !== r.length
          ? Fc(
              r.map(r =>
                Bc(() => {
                  const s = bp(r, e, n)
                  let i
                  if (
                    (function (t) {
                      return t && op(t.canActivate)
                    })(s)
                  )
                    i = cd(s.canActivate(e, t))
                  else {
                    if (!op(s)) throw new Error('Invalid CanActivate guard')
                    i = cd(s(e, t))
                  }
                  return i.pipe(gh())
                })
              )
            ).pipe(xp())
          : Fc(!0)
      }
      function Ap (t, e, n) {
        const r = e[e.length - 1],
          s = e
            .slice(0, e.length - 1)
            .reverse()
            .map(t =>
              (function (t) {
                const e = t.routeConfig ? t.routeConfig.canActivateChild : null
                return e && 0 !== e.length ? { node: t, guards: e } : null
              })(t)
            )
            .filter(t => null !== t)
            .map(e =>
              Bc(() =>
                Fc(
                  e.guards.map(s => {
                    const i = bp(s, e.node, n)
                    let o
                    if (
                      (function (t) {
                        return t && op(t.canActivateChild)
                      })(i)
                    )
                      o = cd(i.canActivateChild(r, t))
                    else {
                      if (!op(i))
                        throw new Error('Invalid CanActivateChild guard')
                      o = cd(i(r, t))
                    }
                    return o.pipe(gh())
                  })
                ).pipe(xp())
              )
            )
        return Fc(s).pipe(xp())
      }
      class Op {}
      class Ip {
        constructor (t, e, n, r, s, i) {
          ;(this.rootComponentType = t),
            (this.config = e),
            (this.urlTree = n),
            (this.url = r),
            (this.paramsInheritanceStrategy = s),
            (this.relativeLinkResolution = i)
        }
        recognize () {
          try {
            const t = Rp(
                this.urlTree.root,
                [],
                [],
                this.config,
                this.relativeLinkResolution
              ).segmentGroup,
              e = this.processSegmentGroup(this.config, t, 'primary'),
              n = new $d(
                [],
                Object.freeze({}),
                Object.freeze(Object.assign({}, this.urlTree.queryParams)),
                this.urlTree.fragment,
                {},
                'primary',
                this.rootComponentType,
                null,
                this.urlTree.root,
                -1,
                {}
              ),
              r = new Dd(n, e),
              s = new Hd(this.url, r)
            return this.inheritParamsAndData(s._root), Fc(s)
          } catch (t) {
            return new w(e => e.error(t))
          }
        }
        inheritParamsAndData (t) {
          const e = t.value,
            n = Ld(e, this.paramsInheritanceStrategy)
          ;(e.params = Object.freeze(n.params)),
            (e.data = Object.freeze(n.data)),
            t.children.forEach(t => this.inheritParamsAndData(t))
        }
        processSegmentGroup (t, e, n) {
          return 0 === e.segments.length && e.hasChildren()
            ? this.processChildren(t, e)
            : this.processSegment(t, e, e.segments, n)
        }
        processChildren (t, e) {
          const n = md(e, (e, n) => this.processSegmentGroup(t, e, n))
          return (
            (function (t) {
              const e = {}
              t.forEach(t => {
                const n = e[t.value.outlet]
                if (n) {
                  const e = n.url.map(t => t.toString()).join('/'),
                    r = t.value.url.map(t => t.toString()).join('/')
                  throw new Error(
                    `Two segments cannot have the same outlet name: '${e}' and '${r}'.`
                  )
                }
                e[t.value.outlet] = t.value
              })
            })(n),
            n.sort((t, e) =>
              'primary' === t.value.outlet
                ? -1
                : 'primary' === e.value.outlet
                ? 1
                : t.value.outlet.localeCompare(e.value.outlet)
            ),
            n
          )
        }
        processSegment (t, e, n, r) {
          for (const i of t)
            try {
              return this.processSegmentAgainstRoute(i, e, n, r)
            } catch (s) {
              if (!(s instanceof Op)) throw s
            }
          if (this.noLeftoversInUrl(e, n, r)) return []
          throw new Op()
        }
        noLeftoversInUrl (t, e, n) {
          return 0 === e.length && !t.children[n]
        }
        processSegmentAgainstRoute (t, e, n, r) {
          if (t.redirectTo) throw new Op()
          if ((t.outlet || 'primary') !== r) throw new Op()
          let s,
            i = [],
            o = []
          if ('**' === t.path) {
            const i = n.length > 0 ? ld(n).parameters : {}
            s = new $d(
              n,
              i,
              Object.freeze(Object.assign({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              Vp(t),
              r,
              t.component,
              t,
              Mp(e),
              Pp(e) + n.length,
              jp(t)
            )
          } else {
            const a = (function (t, e, n) {
              if ('' === e.path) {
                if ('full' === e.pathMatch && (t.hasChildren() || n.length > 0))
                  throw new Op()
                return { consumedSegments: [], lastChild: 0, parameters: {} }
              }
              const r = (e.matcher || Xh)(n, t, e)
              if (!r) throw new Op()
              const s = {}
              ud(r.posParams, (t, e) => {
                s[e] = t.path
              })
              const i =
                r.consumed.length > 0
                  ? Object.assign(
                      Object.assign({}, s),
                      r.consumed[r.consumed.length - 1].parameters
                    )
                  : s
              return {
                consumedSegments: r.consumed,
                lastChild: r.consumed.length,
                parameters: i
              }
            })(e, t, n)
            ;(i = a.consumedSegments),
              (o = n.slice(a.lastChild)),
              (s = new $d(
                i,
                a.parameters,
                Object.freeze(Object.assign({}, this.urlTree.queryParams)),
                this.urlTree.fragment,
                Vp(t),
                r,
                t.component,
                t,
                Mp(e),
                Pp(e) + i.length,
                jp(t)
              ))
          }
          const a = (function (t) {
              return t.children
                ? t.children
                : t.loadChildren
                ? t._loadedConfig.routes
                : []
            })(t),
            { segmentGroup: l, slicedSegments: u } = Rp(
              e,
              i,
              o,
              a,
              this.relativeLinkResolution
            )
          if (0 === u.length && l.hasChildren()) {
            const t = this.processChildren(a, l)
            return [new Dd(s, t)]
          }
          if (0 === a.length && 0 === u.length) return [new Dd(s, [])]
          const c = this.processSegment(a, l, u, 'primary')
          return [new Dd(s, c)]
        }
      }
      function Mp (t) {
        let e = t
        for (; e._sourceSegment; ) e = e._sourceSegment
        return e
      }
      function Pp (t) {
        let e = t,
          n = e._segmentIndexShift ? e._segmentIndexShift : 0
        for (; e._sourceSegment; )
          (e = e._sourceSegment),
            (n += e._segmentIndexShift ? e._segmentIndexShift : 0)
        return n - 1
      }
      function Rp (t, e, n, r, s) {
        if (
          n.length > 0 &&
          (function (t, e, n) {
            return n.some(n => Np(t, e, n) && 'primary' !== Dp(n))
          })(t, n, r)
        ) {
          const s = new pd(
            e,
            (function (t, e, n, r) {
              const s = {}
              ;(s.primary = r),
                (r._sourceSegment = t),
                (r._segmentIndexShift = e.length)
              for (const i of n)
                if ('' === i.path && 'primary' !== Dp(i)) {
                  const n = new pd([], {})
                  ;(n._sourceSegment = t),
                    (n._segmentIndexShift = e.length),
                    (s[Dp(i)] = n)
                }
              return s
            })(t, e, r, new pd(n, t.children))
          )
          return (
            (s._sourceSegment = t),
            (s._segmentIndexShift = e.length),
            { segmentGroup: s, slicedSegments: [] }
          )
        }
        if (
          0 === n.length &&
          (function (t, e, n) {
            return n.some(n => Np(t, e, n))
          })(t, n, r)
        ) {
          const i = new pd(
            t.segments,
            (function (t, e, n, r, s, i) {
              const o = {}
              for (const a of r)
                if (Np(t, n, a) && !s[Dp(a)]) {
                  const n = new pd([], {})
                  ;(n._sourceSegment = t),
                    (n._segmentIndexShift =
                      'legacy' === i ? t.segments.length : e.length),
                    (o[Dp(a)] = n)
                }
              return Object.assign(Object.assign({}, s), o)
            })(t, e, n, r, t.children, s)
          )
          return (
            (i._sourceSegment = t),
            (i._segmentIndexShift = e.length),
            { segmentGroup: i, slicedSegments: n }
          )
        }
        const i = new pd(t.segments, t.children)
        return (
          (i._sourceSegment = t),
          (i._segmentIndexShift = e.length),
          { segmentGroup: i, slicedSegments: n }
        )
      }
      function Np (t, e, n) {
        return (
          (!(t.hasChildren() || e.length > 0) || 'full' !== n.pathMatch) &&
          '' === n.path &&
          void 0 === n.redirectTo
        )
      }
      function Dp (t) {
        return t.outlet || 'primary'
      }
      function Vp (t) {
        return t.data || {}
      }
      function jp (t) {
        return t.resolve || {}
      }
      function Fp (t, e, n, r) {
        const s = bp(t, e, r)
        return cd(s.resolve ? s.resolve(e, n) : s(e, n))
      }
      function Up (t) {
        return function (e) {
          return e.pipe(
            vh(e => {
              const n = t(e)
              return n ? $(n).pipe(j(() => e)) : $([e])
            })
          )
        }
      }
      class Lp {
        shouldDetach (t) {
          return !1
        }
        store (t, e) {}
        shouldAttach (t) {
          return !1
        }
        retrieve (t) {
          return null
        }
        shouldReuseRoute (t, e) {
          return t.routeConfig === e.routeConfig
        }
      }
      const $p = new jt('ROUTES')
      class Hp {
        constructor (t, e, n, r) {
          ;(this.loader = t),
            (this.compiler = e),
            (this.onLoadStartListener = n),
            (this.onLoadEndListener = r)
        }
        load (t, e) {
          return (
            this.onLoadStartListener && this.onLoadStartListener(e),
            this.loadModuleFactory(e.loadChildren).pipe(
              j(n => {
                this.onLoadEndListener && this.onLoadEndListener(e)
                const r = n.create(t)
                return new td(ad(r.injector.get($p)).map(sd), r)
              })
            )
          )
        }
        loadModuleFactory (t) {
          return 'string' == typeof t
            ? $(this.loader.load(t))
            : cd(t()).pipe(
                H(t =>
                  t instanceof Yt
                    ? Fc(t)
                    : $(this.compiler.compileModuleAsync(t))
                )
              )
        }
      }
      class Gp {
        shouldProcessUrl (t) {
          return !0
        }
        extract (t) {
          return t
        }
        merge (t, e) {
          return t
        }
      }
      function zp (t) {
        throw t
      }
      function qp (t, e, n) {
        return e.parse('/')
      }
      function Bp (t, e) {
        return Fc(null)
      }
      let Wp = (() => {
        class t {
          constructor (t, e, n, r, s, i, o, a) {
            ;(this.rootComponentType = t),
              (this.urlSerializer = e),
              (this.rootContexts = n),
              (this.location = r),
              (this.config = a),
              (this.lastSuccessfulNavigation = null),
              (this.currentNavigation = null),
              (this.navigationId = 0),
              (this.isNgZoneEnabled = !1),
              (this.events = new E()),
              (this.errorHandler = zp),
              (this.malformedUriErrorHandler = qp),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1),
              (this.hooks = {
                beforePreactivation: Bp,
                afterPreactivation: Bp
              }),
              (this.urlHandlingStrategy = new Gp()),
              (this.routeReuseStrategy = new Lp()),
              (this.onSameUrlNavigation = 'ignore'),
              (this.paramsInheritanceStrategy = 'emptyOnly'),
              (this.urlUpdateStrategy = 'deferred'),
              (this.relativeLinkResolution = 'legacy'),
              (this.ngModule = s.get(Kt)),
              (this.console = s.get(Ya))
            const l = s.get(pl)
            ;(this.isNgZoneEnabled = l instanceof pl),
              this.resetConfig(a),
              (this.currentUrlTree = new dd(new pd([], {}), {}, null)),
              (this.rawUrlTree = this.currentUrlTree),
              (this.browserUrlTree = this.currentUrlTree),
              (this.configLoader = new Hp(
                i,
                o,
                t => this.triggerEvent(new Hh(t)),
                t => this.triggerEvent(new Gh(t))
              )),
              (this.routerState = Fd(
                this.currentUrlTree,
                this.rootComponentType
              )),
              (this.transitions = new Uc({
                id: 0,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.currentUrlTree,
                extractedUrl: this.urlHandlingStrategy.extract(
                  this.currentUrlTree
                ),
                urlAfterRedirects: this.urlHandlingStrategy.extract(
                  this.currentUrlTree
                ),
                rawUrl: this.currentUrlTree,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: 'imperative',
                restoredState: null,
                currentSnapshot: this.routerState.snapshot,
                targetSnapshot: null,
                currentRouterState: this.routerState,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null
              })),
              (this.navigations = this.setupNavigations(this.transitions)),
              this.processNavigations()
          }
          setupNavigations (t) {
            const e = this.events
            return t.pipe(
              Zc(t => 0 !== t.id),
              j(t =>
                Object.assign(Object.assign({}, t), {
                  extractedUrl: this.urlHandlingStrategy.extract(t.rawUrl)
                })
              ),
              vh(t => {
                let n = !1,
                  r = !1
                return Fc(t).pipe(
                  kh(t => {
                    this.currentNavigation = {
                      id: t.id,
                      initialUrl: t.currentRawUrl,
                      extractedUrl: t.extractedUrl,
                      trigger: t.source,
                      extras: t.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? Object.assign(
                            Object.assign({}, this.lastSuccessfulNavigation),
                            { previousNavigation: null }
                          )
                        : null
                    }
                  }),
                  vh(t => {
                    const n =
                      !this.navigated ||
                      t.extractedUrl.toString() !==
                        this.browserUrlTree.toString()
                    if (
                      ('reload' === this.onSameUrlNavigation || n) &&
                      this.urlHandlingStrategy.shouldProcessUrl(t.rawUrl)
                    )
                      return Fc(t).pipe(
                        vh(t => {
                          const n = this.transitions.getValue()
                          return (
                            e.next(
                              new Rh(
                                t.id,
                                this.serializeUrl(t.extractedUrl),
                                t.source,
                                t.restoredState
                              )
                            ),
                            n !== this.transitions.getValue() ? zc : [t]
                          )
                        }),
                        vh(t => Promise.resolve(t)),
                        ((r = this.ngModule.injector),
                        (s = this.configLoader),
                        (i = this.urlSerializer),
                        (o = this.config),
                        function (t) {
                          return t.pipe(
                            vh(t =>
                              (function (t, e, n, r, s) {
                                return new pp(t, e, n, r, s).apply()
                              })(r, s, i, t.extractedUrl, o).pipe(
                                j(e =>
                                  Object.assign(Object.assign({}, t), {
                                    urlAfterRedirects: e
                                  })
                                )
                              )
                            )
                          )
                        }),
                        kh(t => {
                          this.currentNavigation = Object.assign(
                            Object.assign({}, this.currentNavigation),
                            { finalUrl: t.urlAfterRedirects }
                          )
                        }),
                        (function (t, e, n, r, s) {
                          return function (i) {
                            return i.pipe(
                              H(i =>
                                (function (
                                  t,
                                  e,
                                  n,
                                  r,
                                  s = 'emptyOnly',
                                  i = 'legacy'
                                ) {
                                  return new Ip(t, e, n, r, s, i).recognize()
                                })(
                                  t,
                                  e,
                                  i.urlAfterRedirects,
                                  n(i.urlAfterRedirects),
                                  r,
                                  s
                                ).pipe(
                                  j(t =>
                                    Object.assign(Object.assign({}, i), {
                                      targetSnapshot: t
                                    })
                                  )
                                )
                              )
                            )
                          }
                        })(
                          this.rootComponentType,
                          this.config,
                          t => this.serializeUrl(t),
                          this.paramsInheritanceStrategy,
                          this.relativeLinkResolution
                        ),
                        kh(t => {
                          'eager' === this.urlUpdateStrategy &&
                            (t.extras.skipLocationChange ||
                              this.setBrowserUrl(
                                t.urlAfterRedirects,
                                !!t.extras.replaceUrl,
                                t.id,
                                t.extras.state
                              ),
                            (this.browserUrlTree = t.urlAfterRedirects))
                        }),
                        kh(t => {
                          const n = new jh(
                            t.id,
                            this.serializeUrl(t.extractedUrl),
                            this.serializeUrl(t.urlAfterRedirects),
                            t.targetSnapshot
                          )
                          e.next(n)
                        })
                      )
                    var r, s, i, o
                    if (
                      n &&
                      this.rawUrlTree &&
                      this.urlHandlingStrategy.shouldProcessUrl(this.rawUrlTree)
                    ) {
                      const {
                          id: n,
                          extractedUrl: r,
                          source: s,
                          restoredState: i,
                          extras: o
                        } = t,
                        a = new Rh(n, this.serializeUrl(r), s, i)
                      e.next(a)
                      const l = Fd(r, this.rootComponentType).snapshot
                      return Fc(
                        Object.assign(Object.assign({}, t), {
                          targetSnapshot: l,
                          urlAfterRedirects: r,
                          extras: Object.assign(Object.assign({}, o), {
                            skipLocationChange: !1,
                            replaceUrl: !1
                          })
                        })
                      )
                    }
                    return (
                      (this.rawUrlTree = t.rawUrl),
                      (this.browserUrlTree = t.urlAfterRedirects),
                      t.resolve(null),
                      zc
                    )
                  }),
                  Up(t => {
                    const {
                      targetSnapshot: e,
                      id: n,
                      extractedUrl: r,
                      rawUrl: s,
                      extras: { skipLocationChange: i, replaceUrl: o }
                    } = t
                    return this.hooks.beforePreactivation(e, {
                      navigationId: n,
                      appliedUrlTree: r,
                      rawUrlTree: s,
                      skipLocationChange: !!i,
                      replaceUrl: !!o
                    })
                  }),
                  kh(t => {
                    const e = new Fh(
                      t.id,
                      this.serializeUrl(t.extractedUrl),
                      this.serializeUrl(t.urlAfterRedirects),
                      t.targetSnapshot
                    )
                    this.triggerEvent(e)
                  }),
                  j(t =>
                    Object.assign(Object.assign({}, t), {
                      guards: wp(
                        t.targetSnapshot,
                        t.currentSnapshot,
                        this.rootContexts
                      )
                    })
                  ),
                  (function (t, e) {
                    return function (n) {
                      return n.pipe(
                        H(n => {
                          const {
                            targetSnapshot: r,
                            currentSnapshot: s,
                            guards: {
                              canActivateChecks: i,
                              canDeactivateChecks: o
                            }
                          } = n
                          return 0 === o.length && 0 === i.length
                            ? Fc(
                                Object.assign(Object.assign({}, n), {
                                  guardsResult: !0
                                })
                              )
                            : (function (t, e, n, r) {
                                return $(t).pipe(
                                  H(t =>
                                    (function (t, e, n, r, s) {
                                      const i =
                                        e && e.routeConfig
                                          ? e.routeConfig.canDeactivate
                                          : null
                                      return i && 0 !== i.length
                                        ? Fc(
                                            i.map(i => {
                                              const o = bp(i, e, s)
                                              let a
                                              if (
                                                (function (t) {
                                                  return (
                                                    t && op(t.canDeactivate)
                                                  )
                                                })(o)
                                              )
                                                a = cd(
                                                  o.canDeactivate(t, e, n, r)
                                                )
                                              else {
                                                if (!op(o))
                                                  throw new Error(
                                                    'Invalid CanDeactivate guard'
                                                  )
                                                a = cd(o(t, e, n, r))
                                              }
                                              return a.pipe(gh())
                                            })
                                          ).pipe(xp())
                                        : Fc(!0)
                                    })(t.component, t.route, n, e, r)
                                  ),
                                  gh(t => !0 !== t, !0)
                                )
                              })(o, r, s, t).pipe(
                                H(n =>
                                  n && 'boolean' == typeof n
                                    ? (function (t, e, n, r) {
                                        return $(e).pipe(
                                          Eh(e =>
                                            $([
                                              Tp(e.route.parent, r),
                                              Ep(e.route, r),
                                              Ap(t, e.path, n),
                                              kp(t, e.route, n)
                                            ]).pipe(
                                              Wc(),
                                              gh(t => !0 !== t, !0)
                                            )
                                          ),
                                          gh(t => !0 !== t, !0)
                                        )
                                      })(r, i, t, e)
                                    : Fc(n)
                                ),
                                j(t =>
                                  Object.assign(Object.assign({}, n), {
                                    guardsResult: t
                                  })
                                )
                              )
                        })
                      )
                    }
                  })(this.ngModule.injector, t => this.triggerEvent(t)),
                  kh(t => {
                    if (ap(t.guardsResult)) {
                      const e = Yh(
                        `Redirecting to "${this.serializeUrl(t.guardsResult)}"`
                      )
                      throw ((e.url = t.guardsResult), e)
                    }
                  }),
                  kh(t => {
                    const e = new Uh(
                      t.id,
                      this.serializeUrl(t.extractedUrl),
                      this.serializeUrl(t.urlAfterRedirects),
                      t.targetSnapshot,
                      !!t.guardsResult
                    )
                    this.triggerEvent(e)
                  }),
                  Zc(t => {
                    if (!t.guardsResult) {
                      this.resetUrlToCurrentUrlTree()
                      const n = new Dh(
                        t.id,
                        this.serializeUrl(t.extractedUrl),
                        ''
                      )
                      return e.next(n), t.resolve(!1), !1
                    }
                    return !0
                  }),
                  Up(t => {
                    if (t.guards.canActivateChecks.length)
                      return Fc(t).pipe(
                        kh(t => {
                          const e = new Lh(
                            t.id,
                            this.serializeUrl(t.extractedUrl),
                            this.serializeUrl(t.urlAfterRedirects),
                            t.targetSnapshot
                          )
                          this.triggerEvent(e)
                        }),
                        ((e = this.paramsInheritanceStrategy),
                        (n = this.ngModule.injector),
                        function (t) {
                          return t.pipe(
                            H(t => {
                              const {
                                targetSnapshot: r,
                                guards: { canActivateChecks: s }
                              } = t
                              return s.length
                                ? $(s).pipe(
                                    Eh(t =>
                                      (function (t, e, n, r) {
                                        return (function (t, e, n, r) {
                                          const s = Object.keys(t)
                                          if (0 === s.length) return Fc({})
                                          if (1 === s.length) {
                                            const i = s[0]
                                            return Fp(t[i], e, n, r).pipe(
                                              j(t => ({ [i]: t }))
                                            )
                                          }
                                          const i = {}
                                          return $(s)
                                            .pipe(
                                              H(s =>
                                                Fp(t[s], e, n, r).pipe(
                                                  j(t => ((i[s] = t), t))
                                                )
                                              )
                                            )
                                            .pipe(
                                              lh(),
                                              j(() => i)
                                            )
                                        })(t._resolve, t, e, r).pipe(
                                          j(
                                            e => (
                                              (t._resolvedData = e),
                                              (t.data = Object.assign(
                                                Object.assign({}, t.data),
                                                Ld(t, n).resolve
                                              )),
                                              null
                                            )
                                          )
                                        )
                                      })(t.route, r, e, n)
                                    ),
                                    (function (t, e) {
                                      return arguments.length >= 2
                                        ? function (n) {
                                            return v(Ch(t, e), Yc(1), ih(e))(n)
                                          }
                                        : function (e) {
                                            return v(
                                              Ch((e, n, r) => t(e, n, r + 1)),
                                              Yc(1)
                                            )(e)
                                          }
                                    })((t, e) => t),
                                    j(e => t)
                                  )
                                : Fc(t)
                            })
                          )
                        }),
                        kh(t => {
                          const e = new $h(
                            t.id,
                            this.serializeUrl(t.extractedUrl),
                            this.serializeUrl(t.urlAfterRedirects),
                            t.targetSnapshot
                          )
                          this.triggerEvent(e)
                        })
                      )
                    var e, n
                  }),
                  Up(t => {
                    const {
                      targetSnapshot: e,
                      id: n,
                      extractedUrl: r,
                      rawUrl: s,
                      extras: { skipLocationChange: i, replaceUrl: o }
                    } = t
                    return this.hooks.afterPreactivation(e, {
                      navigationId: n,
                      appliedUrlTree: r,
                      rawUrlTree: s,
                      skipLocationChange: !!i,
                      replaceUrl: !!o
                    })
                  }),
                  j(t => {
                    const e = (function (t, e, n) {
                      const r = (function t (e, n, r) {
                        if (
                          r &&
                          e.shouldReuseRoute(n.value, r.value.snapshot)
                        ) {
                          const s = r.value
                          s._futureSnapshot = n.value
                          const i = (function (e, n, r) {
                            return n.children.map(n => {
                              for (const s of r.children)
                                if (
                                  e.shouldReuseRoute(s.value.snapshot, n.value)
                                )
                                  return t(e, n, s)
                              return t(e, n)
                            })
                          })(e, n, r)
                          return new Dd(s, i)
                        }
                        {
                          const r = e.retrieve(n.value)
                          if (r) {
                            const t = r.route
                            return (
                              (function t (e, n) {
                                if (e.value.routeConfig !== n.value.routeConfig)
                                  throw new Error(
                                    'Cannot reattach ActivatedRouteSnapshot created from a different route'
                                  )
                                if (e.children.length !== n.children.length)
                                  throw new Error(
                                    'Cannot reattach ActivatedRouteSnapshot with a different number of children'
                                  )
                                n.value._futureSnapshot = e.value
                                for (let r = 0; r < e.children.length; ++r)
                                  t(e.children[r], n.children[r])
                              })(n, t),
                              t
                            )
                          }
                          {
                            const r = new Ud(
                                new Uc((s = n.value).url),
                                new Uc(s.params),
                                new Uc(s.queryParams),
                                new Uc(s.fragment),
                                new Uc(s.data),
                                s.outlet,
                                s.component,
                                s
                              ),
                              i = n.children.map(n => t(e, n))
                            return new Dd(r, i)
                          }
                        }
                        var s
                      })(t, e._root, n ? n._root : void 0)
                      return new jd(r, e)
                    })(
                      this.routeReuseStrategy,
                      t.targetSnapshot,
                      t.currentRouterState
                    )
                    return Object.assign(Object.assign({}, t), {
                      targetRouterState: e
                    })
                  }),
                  kh(t => {
                    ;(this.currentUrlTree = t.urlAfterRedirects),
                      (this.rawUrlTree = this.urlHandlingStrategy.merge(
                        this.currentUrlTree,
                        t.rawUrl
                      )),
                      (this.routerState = t.targetRouterState),
                      'deferred' === this.urlUpdateStrategy &&
                        (t.extras.skipLocationChange ||
                          this.setBrowserUrl(
                            this.rawUrlTree,
                            !!t.extras.replaceUrl,
                            t.id,
                            t.extras.state
                          ),
                        (this.browserUrlTree = t.urlAfterRedirects))
                  }),
                  ((i = this.rootContexts),
                  (o = this.routeReuseStrategy),
                  (a = t => this.triggerEvent(t)),
                  j(
                    t => (
                      new sp(
                        o,
                        t.targetRouterState,
                        t.currentRouterState,
                        a
                      ).activate(i),
                      t
                    )
                  )),
                  kh({
                    next () {
                      n = !0
                    },
                    complete () {
                      n = !0
                    }
                  }),
                  ((s = () => {
                    if (!n && !r) {
                      this.resetUrlToCurrentUrlTree()
                      const n = new Dh(
                        t.id,
                        this.serializeUrl(t.extractedUrl),
                        `Navigation ID ${t.id} is not equal to the current navigation id ${this.navigationId}`
                      )
                      e.next(n), t.resolve(!1)
                    }
                    this.currentNavigation = null
                  }),
                  t => t.lift(new Ih(s))),
                  uh(n => {
                    if (((r = !0), (s = n) && s.ngNavigationCancelingError)) {
                      const r = ap(n.url)
                      r ||
                        ((this.navigated = !0),
                        this.resetStateAndUrl(
                          t.currentRouterState,
                          t.currentUrlTree,
                          t.rawUrl
                        ))
                      const s = new Dh(
                        t.id,
                        this.serializeUrl(t.extractedUrl),
                        n.message
                      )
                      e.next(s),
                        r
                          ? setTimeout(() => {
                              const e = this.urlHandlingStrategy.merge(
                                n.url,
                                this.rawUrlTree
                              )
                              return this.scheduleNavigation(
                                e,
                                'imperative',
                                null,
                                {
                                  skipLocationChange:
                                    t.extras.skipLocationChange,
                                  replaceUrl: 'eager' === this.urlUpdateStrategy
                                },
                                {
                                  resolve: t.resolve,
                                  reject: t.reject,
                                  promise: t.promise
                                }
                              )
                            }, 0)
                          : t.resolve(!1)
                    } else {
                      this.resetStateAndUrl(
                        t.currentRouterState,
                        t.currentUrlTree,
                        t.rawUrl
                      )
                      const r = new Vh(
                        t.id,
                        this.serializeUrl(t.extractedUrl),
                        n
                      )
                      e.next(r)
                      try {
                        t.resolve(this.errorHandler(n))
                      } catch (i) {
                        t.reject(i)
                      }
                    }
                    var s
                    return zc
                  })
                )
                var s, i, o, a
              })
            )
          }
          resetRootComponentType (t) {
            ;(this.rootComponentType = t),
              (this.routerState.root.component = this.rootComponentType)
          }
          getTransition () {
            const t = this.transitions.value
            return (t.urlAfterRedirects = this.browserUrlTree), t
          }
          setTransition (t) {
            this.transitions.next(
              Object.assign(Object.assign({}, this.getTransition()), t)
            )
          }
          initialNavigation () {
            this.setUpLocationChangeListener(),
              0 === this.navigationId &&
                this.navigateByUrl(this.location.path(!0), { replaceUrl: !0 })
          }
          setUpLocationChangeListener () {
            this.locationSubscription ||
              (this.locationSubscription = this.location.subscribe(t => {
                let e = this.parseUrl(t.url)
                const n = 'popstate' === t.type ? 'popstate' : 'hashchange',
                  r = t.state && t.state.navigationId ? t.state : null
                setTimeout(() => {
                  this.scheduleNavigation(e, n, r, { replaceUrl: !0 })
                }, 0)
              }))
          }
          get url () {
            return this.serializeUrl(this.currentUrlTree)
          }
          getCurrentNavigation () {
            return this.currentNavigation
          }
          triggerEvent (t) {
            this.events.next(t)
          }
          resetConfig (t) {
            ed(t),
              (this.config = t.map(sd)),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1)
          }
          ngOnDestroy () {
            this.dispose()
          }
          dispose () {
            this.locationSubscription &&
              (this.locationSubscription.unsubscribe(),
              (this.locationSubscription = null))
          }
          createUrlTree (t, e = {}) {
            const {
              relativeTo: n,
              queryParams: r,
              fragment: s,
              preserveQueryParams: i,
              queryParamsHandling: o,
              preserveFragment: a
            } = e
            ar() &&
              i &&
              console &&
              console.warn &&
              console.warn(
                'preserveQueryParams is deprecated, use queryParamsHandling instead.'
              )
            const l = n || this.routerState.root,
              u = a ? this.currentUrlTree.fragment : s
            let c = null
            if (o)
              switch (o) {
                case 'merge':
                  c = Object.assign(
                    Object.assign({}, this.currentUrlTree.queryParams),
                    r
                  )
                  break
                case 'preserve':
                  c = this.currentUrlTree.queryParams
                  break
                default:
                  c = r || null
              }
            else c = i ? this.currentUrlTree.queryParams : r || null
            return (
              null !== c && (c = this.removeEmptyProps(c)),
              (function (t, e, n, r, s) {
                if (0 === n.length) return Zd(e.root, e.root, e, r, s)
                const i = (function (t) {
                  if ('string' == typeof t[0] && 1 === t.length && '/' === t[0])
                    return new Qd(!0, 0, t)
                  let e = 0,
                    n = !1
                  const r = t.reduce((t, r, s) => {
                    if ('object' == typeof r && null != r) {
                      if (r.outlets) {
                        const e = {}
                        return (
                          ud(r.outlets, (t, n) => {
                            e[n] = 'string' == typeof t ? t.split('/') : t
                          }),
                          [...t, { outlets: e }]
                        )
                      }
                      if (r.segmentPath) return [...t, r.segmentPath]
                    }
                    return 'string' != typeof r
                      ? [...t, r]
                      : 0 === s
                      ? (r.split('/').forEach((r, s) => {
                          ;(0 == s && '.' === r) ||
                            (0 == s && '' === r
                              ? (n = !0)
                              : '..' === r
                              ? e++
                              : '' != r && t.push(r))
                        }),
                        t)
                      : [...t, r]
                  }, [])
                  return new Qd(n, e, r)
                })(n)
                if (i.toRoot()) return Zd(e.root, new pd([], {}), e, r, s)
                const o = (function (t, e, n) {
                    if (t.isAbsolute) return new Jd(e.root, !0, 0)
                    if (-1 === n.snapshot._lastPathIndex)
                      return new Jd(n.snapshot._urlSegment, !0, 0)
                    const r = Wd(t.commands[0]) ? 0 : 1
                    return (function (t, e, n) {
                      let r = t,
                        s = e,
                        i = n
                      for (; i > s; ) {
                        if (((i -= s), (r = r.parent), !r))
                          throw new Error("Invalid number of '../'")
                        s = r.segments.length
                      }
                      return new Jd(r, !1, s - i)
                    })(
                      n.snapshot._urlSegment,
                      n.snapshot._lastPathIndex + r,
                      t.numberOfDoubleDots
                    )
                  })(i, e, t),
                  a = o.processChildren
                    ? Xd(o.segmentGroup, o.index, i.commands)
                    : Yd(o.segmentGroup, o.index, i.commands)
                return Zd(o.segmentGroup, a, e, r, s)
              })(l, this.currentUrlTree, t, c, u)
            )
          }
          navigateByUrl (t, e = { skipLocationChange: !1 }) {
            ar() &&
              this.isNgZoneEnabled &&
              !pl.isInAngularZone() &&
              this.console.warn(
                "Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()'?"
              )
            const n = ap(t) ? t : this.parseUrl(t),
              r = this.urlHandlingStrategy.merge(n, this.rawUrlTree)
            return this.scheduleNavigation(r, 'imperative', null, e)
          }
          navigate (t, e = { skipLocationChange: !1 }) {
            return (
              (function (t) {
                for (let e = 0; e < t.length; e++) {
                  const n = t[e]
                  if (null == n)
                    throw new Error(
                      `The requested path contains ${n} segment at index ${e}`
                    )
                }
              })(t),
              this.navigateByUrl(this.createUrlTree(t, e), e)
            )
          }
          serializeUrl (t) {
            return this.urlSerializer.serialize(t)
          }
          parseUrl (t) {
            let e
            try {
              e = this.urlSerializer.parse(t)
            } catch (n) {
              e = this.malformedUriErrorHandler(n, this.urlSerializer, t)
            }
            return e
          }
          isActive (t, e) {
            if (ap(t)) return hd(this.currentUrlTree, t, e)
            const n = this.parseUrl(t)
            return hd(this.currentUrlTree, n, e)
          }
          removeEmptyProps (t) {
            return Object.keys(t).reduce((e, n) => {
              const r = t[n]
              return null != r && (e[n] = r), e
            }, {})
          }
          processNavigations () {
            this.navigations.subscribe(
              t => {
                ;(this.navigated = !0),
                  (this.lastSuccessfulId = t.id),
                  this.events.next(
                    new Nh(
                      t.id,
                      this.serializeUrl(t.extractedUrl),
                      this.serializeUrl(this.currentUrlTree)
                    )
                  ),
                  (this.lastSuccessfulNavigation = this.currentNavigation),
                  (this.currentNavigation = null),
                  t.resolve(!0)
              },
              t => {
                this.console.warn('Unhandled Navigation Error: ')
              }
            )
          }
          scheduleNavigation (t, e, n, r, s) {
            const i = this.getTransition()
            if (
              i &&
              'imperative' !== e &&
              'imperative' === i.source &&
              i.rawUrl.toString() === t.toString()
            )
              return Promise.resolve(!0)
            if (
              i &&
              'hashchange' == e &&
              'popstate' === i.source &&
              i.rawUrl.toString() === t.toString()
            )
              return Promise.resolve(!0)
            if (
              i &&
              'popstate' == e &&
              'hashchange' === i.source &&
              i.rawUrl.toString() === t.toString()
            )
              return Promise.resolve(!0)
            let o, a, l
            s
              ? ((o = s.resolve), (a = s.reject), (l = s.promise))
              : (l = new Promise((t, e) => {
                  ;(o = t), (a = e)
                }))
            const u = ++this.navigationId
            return (
              this.setTransition({
                id: u,
                source: e,
                restoredState: n,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.rawUrlTree,
                rawUrl: t,
                extras: r,
                resolve: o,
                reject: a,
                promise: l,
                currentSnapshot: this.routerState.snapshot,
                currentRouterState: this.routerState
              }),
              l.catch(t => Promise.reject(t))
            )
          }
          setBrowserUrl (t, e, n, r) {
            const s = this.urlSerializer.serialize(t)
            ;(r = r || {}),
              this.location.isCurrentPathEqualTo(s) || e
                ? this.location.replaceState(
                    s,
                    '',
                    Object.assign(Object.assign({}, r), { navigationId: n })
                  )
                : this.location.go(
                    s,
                    '',
                    Object.assign(Object.assign({}, r), { navigationId: n })
                  )
          }
          resetStateAndUrl (t, e, n) {
            ;(this.routerState = t),
              (this.currentUrlTree = e),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                this.currentUrlTree,
                n
              )),
              this.resetUrlToCurrentUrlTree()
          }
          resetUrlToCurrentUrlTree () {
            this.location.replaceState(
              this.urlSerializer.serialize(this.rawUrlTree),
              '',
              { navigationId: this.lastSuccessfulId }
            )
          }
        }
        return (
          (t.ɵfac = function (t) {
            Ri()
          }),
          (t.ɵdir = me({ type: t })),
          t
        )
      })()
      class Zp {
        constructor () {
          ;(this.outlet = null),
            (this.route = null),
            (this.resolver = null),
            (this.children = new Qp()),
            (this.attachRef = null)
        }
      }
      class Qp {
        constructor () {
          this.contexts = new Map()
        }
        onChildOutletCreated (t, e) {
          const n = this.getOrCreateContext(t)
          ;(n.outlet = e), this.contexts.set(t, n)
        }
        onChildOutletDestroyed (t) {
          const e = this.getContext(t)
          e && (e.outlet = null)
        }
        onOutletDeactivated () {
          const t = this.contexts
          return (this.contexts = new Map()), t
        }
        onOutletReAttached (t) {
          this.contexts = t
        }
        getOrCreateContext (t) {
          let e = this.getContext(t)
          return e || ((e = new Zp()), this.contexts.set(t, e)), e
        }
        getContext (t) {
          return this.contexts.get(t) || null
        }
      }
      let Jp = (() => {
        class t {
          constructor (t, e, n, r, s) {
            ;(this.parentContexts = t),
              (this.location = e),
              (this.resolver = n),
              (this.changeDetector = s),
              (this.activated = null),
              (this._activatedRoute = null),
              (this.activateEvents = new Aa()),
              (this.deactivateEvents = new Aa()),
              (this.name = r || 'primary'),
              t.onChildOutletCreated(this.name, this)
          }
          ngOnDestroy () {
            this.parentContexts.onChildOutletDestroyed(this.name)
          }
          ngOnInit () {
            if (!this.activated) {
              const t = this.parentContexts.getContext(this.name)
              t &&
                t.route &&
                (t.attachRef
                  ? this.attach(t.attachRef, t.route)
                  : this.activateWith(t.route, t.resolver || null))
            }
          }
          get isActivated () {
            return !!this.activated
          }
          get component () {
            if (!this.activated) throw new Error('Outlet is not activated')
            return this.activated.instance
          }
          get activatedRoute () {
            if (!this.activated) throw new Error('Outlet is not activated')
            return this._activatedRoute
          }
          get activatedRouteData () {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {}
          }
          detach () {
            if (!this.activated) throw new Error('Outlet is not activated')
            this.location.detach()
            const t = this.activated
            return (this.activated = null), (this._activatedRoute = null), t
          }
          attach (t, e) {
            ;(this.activated = t),
              (this._activatedRoute = e),
              this.location.insert(t.hostView)
          }
          deactivate () {
            if (this.activated) {
              const t = this.component
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(t)
            }
          }
          activateWith (t, e) {
            if (this.isActivated)
              throw new Error('Cannot activate an already activated outlet')
            this._activatedRoute = t
            const n = (e = e || this.resolver).resolveComponentFactory(
                t._futureSnapshot.routeConfig.component
              ),
              r = this.parentContexts.getOrCreateContext(this.name).children,
              s = new Kp(t, r, this.location.injector)
            ;(this.activated = this.location.createComponent(
              n,
              this.location.length,
              s
            )),
              this.changeDetector.markForCheck(),
              this.activateEvents.emit(this.activated.instance)
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(
              Pi(Qp),
              Pi(ea),
              Pi(Ao),
              ('name',
              (function (t, e) {
                const n = t.attrs
                if (n) {
                  const t = n.length
                  let e = 0
                  for (; e < t; ) {
                    const r = n[e]
                    if (xn(r)) break
                    if (0 === r) e += 2
                    else if ('number' == typeof r)
                      for (e++; e < t && 'string' == typeof n[e]; ) e++
                    else {
                      if ('name' === r) return n[e + 1]
                      e += 2
                    }
                  }
                }
                return null
              })(We())),
              Pi(Js)
            )
          }),
          (t.ɵdir = me({
            type: t,
            selectors: [['router-outlet']],
            outputs: {
              activateEvents: 'activate',
              deactivateEvents: 'deactivate'
            },
            exportAs: ['outlet']
          })),
          t
        )
      })()
      class Kp {
        constructor (t, e, n) {
          ;(this.route = t), (this.childContexts = e), (this.parent = n)
        }
        get (t, e) {
          return t === Ud
            ? this.route
            : t === Qp
            ? this.childContexts
            : this.parent.get(t, e)
        }
      }
      class Yp {}
      class Xp {
        preload (t, e) {
          return Fc(null)
        }
      }
      let tf = (() => {
          class t {
            constructor (t, e, n, r, s) {
              ;(this.router = t),
                (this.injector = r),
                (this.preloadingStrategy = s),
                (this.loader = new Hp(
                  e,
                  n,
                  e => t.triggerEvent(new Hh(e)),
                  e => t.triggerEvent(new Gh(e))
                ))
            }
            setUpPreloading () {
              this.subscription = this.router.events
                .pipe(
                  Zc(t => t instanceof Nh),
                  Eh(() => this.preload())
                )
                .subscribe(() => {})
            }
            preload () {
              const t = this.injector.get(Kt)
              return this.processRoutes(t, this.router.config)
            }
            ngOnDestroy () {
              this.subscription.unsubscribe()
            }
            processRoutes (t, e) {
              const n = []
              for (const r of e)
                if (r.loadChildren && !r.canLoad && r._loadedConfig) {
                  const t = r._loadedConfig
                  n.push(this.processRoutes(t.module, t.routes))
                } else
                  r.loadChildren && !r.canLoad
                    ? n.push(this.preloadConfig(t, r))
                    : r.children && n.push(this.processRoutes(t, r.children))
              return $(n).pipe(
                q(),
                j(t => {})
              )
            }
            preloadConfig (t, e) {
              return this.preloadingStrategy.preload(e, () =>
                this.loader
                  .load(t.injector, e)
                  .pipe(
                    H(
                      t => (
                        (e._loadedConfig = t),
                        this.processRoutes(t.module, t.routes)
                      )
                    )
                  )
              )
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Wt(Wp), Wt(Dl), Wt(ul), Wt(di), Wt(Yp))
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })(),
        ef = (() => {
          class t {
            constructor (t, e, n = {}) {
              ;(this.router = t),
                (this.viewportScroller = e),
                (this.options = n),
                (this.lastId = 0),
                (this.lastSource = 'imperative'),
                (this.restoredId = 0),
                (this.store = {}),
                (n.scrollPositionRestoration =
                  n.scrollPositionRestoration || 'disabled'),
                (n.anchorScrolling = n.anchorScrolling || 'disabled')
            }
            init () {
              'disabled' !== this.options.scrollPositionRestoration &&
                this.viewportScroller.setHistoryScrollRestoration('manual'),
                (this.routerEventsSubscription = this.createScrollEvents()),
                (this.scrollEventsSubscription = this.consumeScrollEvents())
            }
            createScrollEvents () {
              return this.router.events.subscribe(t => {
                t instanceof Rh
                  ? ((this.store[this.lastId] =
                      this.viewportScroller.getScrollPosition()),
                    (this.lastSource = t.navigationTrigger),
                    (this.restoredId = t.restoredState
                      ? t.restoredState.navigationId
                      : 0))
                  : t instanceof Nh &&
                    ((this.lastId = t.id),
                    this.scheduleScrollEvent(
                      t,
                      this.router.parseUrl(t.urlAfterRedirects).fragment
                    ))
              })
            }
            consumeScrollEvents () {
              return this.router.events.subscribe(t => {
                t instanceof Zh &&
                  (t.position
                    ? 'top' === this.options.scrollPositionRestoration
                      ? this.viewportScroller.scrollToPosition([0, 0])
                      : 'enabled' === this.options.scrollPositionRestoration &&
                        this.viewportScroller.scrollToPosition(t.position)
                    : t.anchor && 'enabled' === this.options.anchorScrolling
                    ? this.viewportScroller.scrollToAnchor(t.anchor)
                    : 'disabled' !== this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition([0, 0]))
              })
            }
            scheduleScrollEvent (t, e) {
              this.router.triggerEvent(
                new Zh(
                  t,
                  'popstate' === this.lastSource
                    ? this.store[this.restoredId]
                    : null,
                  e
                )
              )
            }
            ngOnDestroy () {
              this.routerEventsSubscription &&
                this.routerEventsSubscription.unsubscribe(),
                this.scrollEventsSubscription &&
                  this.scrollEventsSubscription.unsubscribe()
            }
          }
          return (
            (t.ɵfac = function (t) {
              Ri()
            }),
            (t.ɵdir = me({ type: t })),
            t
          )
        })()
      const nf = new jt('ROUTER_CONFIGURATION'),
        rf = new jt('ROUTER_FORROOT_GUARD'),
        sf = [
          uu,
          { provide: yd, useClass: vd },
          {
            provide: Wp,
            useFactory: function (t, e, n, r, s, i, o, a = {}, l, u) {
              const c = new Wp(null, t, e, n, r, s, i, ad(o))
              if (
                (l && (c.urlHandlingStrategy = l),
                u && (c.routeReuseStrategy = u),
                a.errorHandler && (c.errorHandler = a.errorHandler),
                a.malformedUriErrorHandler &&
                  (c.malformedUriErrorHandler = a.malformedUriErrorHandler),
                a.enableTracing)
              ) {
                const t = Wl()
                c.events.subscribe(e => {
                  t.logGroup(`Router Event: ${e.constructor.name}`),
                    t.log(e.toString()),
                    t.log(e),
                    t.logGroupEnd()
                })
              }
              return (
                a.onSameUrlNavigation &&
                  (c.onSameUrlNavigation = a.onSameUrlNavigation),
                a.paramsInheritanceStrategy &&
                  (c.paramsInheritanceStrategy = a.paramsInheritanceStrategy),
                a.urlUpdateStrategy &&
                  (c.urlUpdateStrategy = a.urlUpdateStrategy),
                a.relativeLinkResolution &&
                  (c.relativeLinkResolution = a.relativeLinkResolution),
                c
              )
            },
            deps: [
              yd,
              Qp,
              uu,
              di,
              Dl,
              ul,
              $p,
              nf,
              [class {}, new rt()],
              [class {}, new rt()]
            ]
          },
          Qp,
          {
            provide: Ud,
            useFactory: function (t) {
              return t.routerState.root
            },
            deps: [Wp]
          },
          { provide: Dl, useClass: Fl },
          tf,
          Xp,
          class {
            preload (t, e) {
              return e().pipe(uh(() => Fc(null)))
            }
          },
          { provide: nf, useValue: { enableTracing: !1 } }
        ]
      function of () {
        return new Al('Router', Wp)
      }
      let af = (() => {
        class t {
          constructor (t, e) {}
          static forRoot (e, n) {
            return {
              ngModule: t,
              providers: [
                sf,
                hf(e),
                {
                  provide: rf,
                  useFactory: cf,
                  deps: [[Wp, new rt(), new it()]]
                },
                { provide: nf, useValue: n || {} },
                {
                  provide: su,
                  useFactory: uf,
                  deps: [Ql, [new nt(ou), new rt()], nf]
                },
                { provide: ef, useFactory: lf, deps: [Wp, rc, nf] },
                {
                  provide: Yp,
                  useExisting:
                    n && n.preloadingStrategy ? n.preloadingStrategy : Xp
                },
                { provide: Al, multi: !0, useFactory: of },
                [
                  df,
                  { provide: za, multi: !0, useFactory: pf, deps: [df] },
                  { provide: gf, useFactory: ff, deps: [df] },
                  { provide: Ka, multi: !0, useExisting: gf }
                ]
              ]
            }
          }
          static forChild (e) {
            return { ngModule: t, providers: [hf(e)] }
          }
        }
        return (
          (t.ɵmod = fe({ type: t })),
          (t.ɵinj = ct({
            factory: function (e) {
              return new (e || t)(Wt(rf, 8), Wt(Wp, 8))
            }
          })),
          t
        )
      })()
      function lf (t, e, n) {
        return n.scrollOffset && e.setOffset(n.scrollOffset), new ef(t, e, n)
      }
      function uf (t, e, n = {}) {
        return n.useHash ? new lu(t, e) : new au(t, e)
      }
      function cf (t) {
        if (t)
          throw new Error(
            'RouterModule.forRoot() called twice. Lazy loaded modules should use RouterModule.forChild() instead.'
          )
        return 'guarded'
      }
      function hf (t) {
        return [
          { provide: pi, multi: !0, useValue: t },
          { provide: $p, multi: !0, useValue: t }
        ]
      }
      let df = (() => {
        class t {
          constructor (t) {
            ;(this.injector = t),
              (this.initNavigation = !1),
              (this.resultOfPreactivationDone = new E())
          }
          appInitializer () {
            return this.injector.get(Kl, Promise.resolve(null)).then(() => {
              let t = null
              const e = new Promise(e => (t = e)),
                n = this.injector.get(Wp),
                r = this.injector.get(nf)
              if (this.isLegacyDisabled(r) || this.isLegacyEnabled(r)) t(!0)
              else if ('disabled' === r.initialNavigation)
                n.setUpLocationChangeListener(), t(!0)
              else {
                if ('enabled' !== r.initialNavigation)
                  throw new Error(
                    `Invalid initialNavigation options: '${r.initialNavigation}'`
                  )
                ;(n.hooks.afterPreactivation = () =>
                  this.initNavigation
                    ? Fc(null)
                    : ((this.initNavigation = !0),
                      t(!0),
                      this.resultOfPreactivationDone)),
                  n.initialNavigation()
              }
              return e
            })
          }
          bootstrapListener (t) {
            const e = this.injector.get(nf),
              n = this.injector.get(tf),
              r = this.injector.get(ef),
              s = this.injector.get(Wp),
              i = this.injector.get(Rl)
            t === i.components[0] &&
              (this.isLegacyEnabled(e)
                ? s.initialNavigation()
                : this.isLegacyDisabled(e) && s.setUpLocationChangeListener(),
              n.setUpPreloading(),
              r.init(),
              s.resetRootComponentType(i.componentTypes[0]),
              this.resultOfPreactivationDone.next(null),
              this.resultOfPreactivationDone.complete())
          }
          isLegacyEnabled (t) {
            return (
              'legacy_enabled' === t.initialNavigation ||
              !0 === t.initialNavigation ||
              void 0 === t.initialNavigation
            )
          }
          isLegacyDisabled (t) {
            return (
              'legacy_disabled' === t.initialNavigation ||
              !1 === t.initialNavigation
            )
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Wt(di))
          }),
          (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
          t
        )
      })()
      function pf (t) {
        return t.appInitializer.bind(t)
      }
      function ff (t) {
        return t.bootstrapListener.bind(t)
      }
      const gf = new jt('Router Initializer')
      class mf {}
      class yf {}
      class vf {
        constructor (t) {
          ;(this.normalizedNames = new Map()),
            (this.lazyUpdate = null),
            t
              ? (this.lazyInit =
                  'string' == typeof t
                    ? () => {
                        ;(this.headers = new Map()),
                          t.split('\n').forEach(t => {
                            const e = t.indexOf(':')
                            if (e > 0) {
                              const n = t.slice(0, e),
                                r = n.toLowerCase(),
                                s = t.slice(e + 1).trim()
                              this.maybeSetNormalizedName(n, r),
                                this.headers.has(r)
                                  ? this.headers.get(r).push(s)
                                  : this.headers.set(r, [s])
                            }
                          })
                      }
                    : () => {
                        ;(this.headers = new Map()),
                          Object.keys(t).forEach(e => {
                            let n = t[e]
                            const r = e.toLowerCase()
                            'string' == typeof n && (n = [n]),
                              n.length > 0 &&
                                (this.headers.set(r, n),
                                this.maybeSetNormalizedName(e, r))
                          })
                      })
              : (this.headers = new Map())
        }
        has (t) {
          return this.init(), this.headers.has(t.toLowerCase())
        }
        get (t) {
          this.init()
          const e = this.headers.get(t.toLowerCase())
          return e && e.length > 0 ? e[0] : null
        }
        keys () {
          return this.init(), Array.from(this.normalizedNames.values())
        }
        getAll (t) {
          return this.init(), this.headers.get(t.toLowerCase()) || null
        }
        append (t, e) {
          return this.clone({ name: t, value: e, op: 'a' })
        }
        set (t, e) {
          return this.clone({ name: t, value: e, op: 's' })
        }
        delete (t, e) {
          return this.clone({ name: t, value: e, op: 'd' })
        }
        maybeSetNormalizedName (t, e) {
          this.normalizedNames.has(e) || this.normalizedNames.set(e, t)
        }
        init () {
          this.lazyInit &&
            (this.lazyInit instanceof vf
              ? this.copyFrom(this.lazyInit)
              : this.lazyInit(),
            (this.lazyInit = null),
            this.lazyUpdate &&
              (this.lazyUpdate.forEach(t => this.applyUpdate(t)),
              (this.lazyUpdate = null)))
        }
        copyFrom (t) {
          t.init(),
            Array.from(t.headers.keys()).forEach(e => {
              this.headers.set(e, t.headers.get(e)),
                this.normalizedNames.set(e, t.normalizedNames.get(e))
            })
        }
        clone (t) {
          const e = new vf()
          return (
            (e.lazyInit =
              this.lazyInit && this.lazyInit instanceof vf
                ? this.lazyInit
                : this),
            (e.lazyUpdate = (this.lazyUpdate || []).concat([t])),
            e
          )
        }
        applyUpdate (t) {
          const e = t.name.toLowerCase()
          switch (t.op) {
            case 'a':
            case 's':
              let n = t.value
              if (('string' == typeof n && (n = [n]), 0 === n.length)) return
              this.maybeSetNormalizedName(t.name, e)
              const r = ('a' === t.op ? this.headers.get(e) : void 0) || []
              r.push(...n), this.headers.set(e, r)
              break
            case 'd':
              const s = t.value
              if (s) {
                let t = this.headers.get(e)
                if (!t) return
                ;(t = t.filter(t => -1 === s.indexOf(t))),
                  0 === t.length
                    ? (this.headers.delete(e), this.normalizedNames.delete(e))
                    : this.headers.set(e, t)
              } else this.headers.delete(e), this.normalizedNames.delete(e)
          }
        }
        forEach (t) {
          this.init(),
            Array.from(this.normalizedNames.keys()).forEach(e =>
              t(this.normalizedNames.get(e), this.headers.get(e))
            )
        }
      }
      class _f {
        encodeKey (t) {
          return wf(t)
        }
        encodeValue (t) {
          return wf(t)
        }
        decodeKey (t) {
          return decodeURIComponent(t)
        }
        decodeValue (t) {
          return decodeURIComponent(t)
        }
      }
      function wf (t) {
        return encodeURIComponent(t)
          .replace(/%40/gi, '@')
          .replace(/%3A/gi, ':')
          .replace(/%24/gi, '$')
          .replace(/%2C/gi, ',')
          .replace(/%3B/gi, ';')
          .replace(/%2B/gi, '+')
          .replace(/%3D/gi, '=')
          .replace(/%3F/gi, '?')
          .replace(/%2F/gi, '/')
      }
      class bf {
        constructor (t = {}) {
          if (
            ((this.updates = null),
            (this.cloneFrom = null),
            (this.encoder = t.encoder || new _f()),
            t.fromString)
          ) {
            if (t.fromObject)
              throw new Error('Cannot specify both fromString and fromObject.')
            this.map = (function (t, e) {
              const n = new Map()
              return (
                t.length > 0 &&
                  t.split('&').forEach(t => {
                    const r = t.indexOf('='),
                      [s, i] =
                        -1 == r
                          ? [e.decodeKey(t), '']
                          : [
                              e.decodeKey(t.slice(0, r)),
                              e.decodeValue(t.slice(r + 1))
                            ],
                      o = n.get(s) || []
                    o.push(i), n.set(s, o)
                  }),
                n
              )
            })(t.fromString, this.encoder)
          } else
            t.fromObject
              ? ((this.map = new Map()),
                Object.keys(t.fromObject).forEach(e => {
                  const n = t.fromObject[e]
                  this.map.set(e, Array.isArray(n) ? n : [n])
                }))
              : (this.map = null)
        }
        has (t) {
          return this.init(), this.map.has(t)
        }
        get (t) {
          this.init()
          const e = this.map.get(t)
          return e ? e[0] : null
        }
        getAll (t) {
          return this.init(), this.map.get(t) || null
        }
        keys () {
          return this.init(), Array.from(this.map.keys())
        }
        append (t, e) {
          return this.clone({ param: t, value: e, op: 'a' })
        }
        set (t, e) {
          return this.clone({ param: t, value: e, op: 's' })
        }
        delete (t, e) {
          return this.clone({ param: t, value: e, op: 'd' })
        }
        toString () {
          return (
            this.init(),
            this.keys()
              .map(t => {
                const e = this.encoder.encodeKey(t)
                return this.map
                  .get(t)
                  .map(t => e + '=' + this.encoder.encodeValue(t))
                  .join('&')
              })
              .filter(t => '' !== t)
              .join('&')
          )
        }
        clone (t) {
          const e = new bf({ encoder: this.encoder })
          return (
            (e.cloneFrom = this.cloneFrom || this),
            (e.updates = (this.updates || []).concat([t])),
            e
          )
        }
        init () {
          null === this.map && (this.map = new Map()),
            null !== this.cloneFrom &&
              (this.cloneFrom.init(),
              this.cloneFrom
                .keys()
                .forEach(t => this.map.set(t, this.cloneFrom.map.get(t))),
              this.updates.forEach(t => {
                switch (t.op) {
                  case 'a':
                  case 's':
                    const e =
                      ('a' === t.op ? this.map.get(t.param) : void 0) || []
                    e.push(t.value), this.map.set(t.param, e)
                    break
                  case 'd':
                    if (void 0 === t.value) {
                      this.map.delete(t.param)
                      break
                    }
                    {
                      let e = this.map.get(t.param) || []
                      const n = e.indexOf(t.value)
                      ;-1 !== n && e.splice(n, 1),
                        e.length > 0
                          ? this.map.set(t.param, e)
                          : this.map.delete(t.param)
                    }
                }
              }),
              (this.cloneFrom = this.updates = null))
        }
      }
      function Cf (t) {
        return 'undefined' != typeof ArrayBuffer && t instanceof ArrayBuffer
      }
      function Sf (t) {
        return 'undefined' != typeof Blob && t instanceof Blob
      }
      function xf (t) {
        return 'undefined' != typeof FormData && t instanceof FormData
      }
      class Ef {
        constructor (t, e, n, r) {
          let s
          if (
            ((this.url = e),
            (this.body = null),
            (this.reportProgress = !1),
            (this.withCredentials = !1),
            (this.responseType = 'json'),
            (this.method = t.toUpperCase()),
            (function (t) {
              switch (t) {
                case 'DELETE':
                case 'GET':
                case 'HEAD':
                case 'OPTIONS':
                case 'JSONP':
                  return !1
                default:
                  return !0
              }
            })(this.method) || r
              ? ((this.body = void 0 !== n ? n : null), (s = r))
              : (s = n),
            s &&
              ((this.reportProgress = !!s.reportProgress),
              (this.withCredentials = !!s.withCredentials),
              s.responseType && (this.responseType = s.responseType),
              s.headers && (this.headers = s.headers),
              s.params && (this.params = s.params)),
            this.headers || (this.headers = new vf()),
            this.params)
          ) {
            const t = this.params.toString()
            if (0 === t.length) this.urlWithParams = e
            else {
              const n = e.indexOf('?')
              this.urlWithParams =
                e + (-1 === n ? '?' : n < e.length - 1 ? '&' : '') + t
            }
          } else (this.params = new bf()), (this.urlWithParams = e)
        }
        serializeBody () {
          return null === this.body
            ? null
            : Cf(this.body) ||
              Sf(this.body) ||
              xf(this.body) ||
              'string' == typeof this.body
            ? this.body
            : this.body instanceof bf
            ? this.body.toString()
            : 'object' == typeof this.body ||
              'boolean' == typeof this.body ||
              Array.isArray(this.body)
            ? JSON.stringify(this.body)
            : this.body.toString()
        }
        detectContentTypeHeader () {
          return null === this.body
            ? null
            : xf(this.body)
            ? null
            : Sf(this.body)
            ? this.body.type || null
            : Cf(this.body)
            ? null
            : 'string' == typeof this.body
            ? 'text/plain'
            : this.body instanceof bf
            ? 'application/x-www-form-urlencoded;charset=UTF-8'
            : 'object' == typeof this.body ||
              'number' == typeof this.body ||
              Array.isArray(this.body)
            ? 'application/json'
            : null
        }
        clone (t = {}) {
          const e = t.method || this.method,
            n = t.url || this.url,
            r = t.responseType || this.responseType,
            s = void 0 !== t.body ? t.body : this.body,
            i =
              void 0 !== t.withCredentials
                ? t.withCredentials
                : this.withCredentials,
            o =
              void 0 !== t.reportProgress
                ? t.reportProgress
                : this.reportProgress
          let a = t.headers || this.headers,
            l = t.params || this.params
          return (
            void 0 !== t.setHeaders &&
              (a = Object.keys(t.setHeaders).reduce(
                (e, n) => e.set(n, t.setHeaders[n]),
                a
              )),
            t.setParams &&
              (l = Object.keys(t.setParams).reduce(
                (e, n) => e.set(n, t.setParams[n]),
                l
              )),
            new Ef(e, n, s, {
              params: l,
              headers: a,
              reportProgress: o,
              responseType: r,
              withCredentials: i
            })
          )
        }
      }
      const Tf = (function () {
        var t = {
          Sent: 0,
          UploadProgress: 1,
          ResponseHeader: 2,
          DownloadProgress: 3,
          Response: 4,
          User: 5
        }
        return (
          (t[t.Sent] = 'Sent'),
          (t[t.UploadProgress] = 'UploadProgress'),
          (t[t.ResponseHeader] = 'ResponseHeader'),
          (t[t.DownloadProgress] = 'DownloadProgress'),
          (t[t.Response] = 'Response'),
          (t[t.User] = 'User'),
          t
        )
      })()
      class kf {
        constructor (t, e = 200, n = 'OK') {
          ;(this.headers = t.headers || new vf()),
            (this.status = void 0 !== t.status ? t.status : e),
            (this.statusText = t.statusText || n),
            (this.url = t.url || null),
            (this.ok = this.status >= 200 && this.status < 300)
        }
      }
      class Af extends kf {
        constructor (t = {}) {
          super(t), (this.type = Tf.ResponseHeader)
        }
        clone (t = {}) {
          return new Af({
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0
          })
        }
      }
      class Of extends kf {
        constructor (t = {}) {
          super(t),
            (this.type = Tf.Response),
            (this.body = void 0 !== t.body ? t.body : null)
        }
        clone (t = {}) {
          return new Of({
            body: void 0 !== t.body ? t.body : this.body,
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0
          })
        }
      }
      class If extends kf {
        constructor (t) {
          super(t, 0, 'Unknown Error'),
            (this.name = 'HttpErrorResponse'),
            (this.ok = !1),
            (this.message =
              this.status >= 200 && this.status < 300
                ? `Http failure during parsing for ${t.url || '(unknown url)'}`
                : `Http failure response for ${t.url || '(unknown url)'}: ${
                    t.status
                  } ${t.statusText}`),
            (this.error = t.error || null)
        }
      }
      function Mf (t, e) {
        return {
          body: e,
          headers: t.headers,
          observe: t.observe,
          params: t.params,
          reportProgress: t.reportProgress,
          responseType: t.responseType,
          withCredentials: t.withCredentials
        }
      }
      let Pf = (() => {
        class t {
          constructor (t) {
            this.handler = t
          }
          request (t, e, n = {}) {
            let r
            if (t instanceof Ef) r = t
            else {
              let s = void 0
              s = n.headers instanceof vf ? n.headers : new vf(n.headers)
              let i = void 0
              n.params &&
                (i =
                  n.params instanceof bf
                    ? n.params
                    : new bf({ fromObject: n.params })),
                (r = new Ef(t, e, void 0 !== n.body ? n.body : null, {
                  headers: s,
                  params: i,
                  reportProgress: n.reportProgress,
                  responseType: n.responseType || 'json',
                  withCredentials: n.withCredentials
                }))
            }
            const s = Fc(r).pipe(Eh(t => this.handler.handle(t)))
            if (t instanceof Ef || 'events' === n.observe) return s
            const i = s.pipe(Zc(t => t instanceof Of))
            switch (n.observe || 'body') {
              case 'body':
                switch (r.responseType) {
                  case 'arraybuffer':
                    return i.pipe(
                      j(t => {
                        if (null !== t.body && !(t.body instanceof ArrayBuffer))
                          throw new Error('Response is not an ArrayBuffer.')
                        return t.body
                      })
                    )
                  case 'blob':
                    return i.pipe(
                      j(t => {
                        if (null !== t.body && !(t.body instanceof Blob))
                          throw new Error('Response is not a Blob.')
                        return t.body
                      })
                    )
                  case 'text':
                    return i.pipe(
                      j(t => {
                        if (null !== t.body && 'string' != typeof t.body)
                          throw new Error('Response is not a string.')
                        return t.body
                      })
                    )
                  case 'json':
                  default:
                    return i.pipe(j(t => t.body))
                }
              case 'response':
                return i
              default:
                throw new Error(
                  `Unreachable: unhandled observe type ${n.observe}}`
                )
            }
          }
          delete (t, e = {}) {
            return this.request('DELETE', t, e)
          }
          get (t, e = {}) {
            return this.request('GET', t, e)
          }
          head (t, e = {}) {
            return this.request('HEAD', t, e)
          }
          jsonp (t, e) {
            return this.request('JSONP', t, {
              params: new bf().append(e, 'JSONP_CALLBACK'),
              observe: 'body',
              responseType: 'json'
            })
          }
          options (t, e = {}) {
            return this.request('OPTIONS', t, e)
          }
          patch (t, e, n = {}) {
            return this.request('PATCH', t, Mf(n, e))
          }
          post (t, e, n = {}) {
            return this.request('POST', t, Mf(n, e))
          }
          put (t, e, n = {}) {
            return this.request('PUT', t, Mf(n, e))
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Wt(mf))
          }),
          (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
          t
        )
      })()
      class Rf {
        constructor (t, e) {
          ;(this.next = t), (this.interceptor = e)
        }
        handle (t) {
          return this.interceptor.intercept(t, this.next)
        }
      }
      const Nf = new jt('HTTP_INTERCEPTORS')
      let Df = (() => {
        class t {
          intercept (t, e) {
            return e.handle(t)
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)()
          }),
          (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
          t
        )
      })()
      const Vf = /^\)\]\}',?\n/
      class jf {}
      let Ff = (() => {
          class t {
            constructor () {}
            build () {
              return new XMLHttpRequest()
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)()
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })(),
        Uf = (() => {
          class t {
            constructor (t) {
              this.xhrFactory = t
            }
            handle (t) {
              if ('JSONP' === t.method)
                throw new Error(
                  'Attempted to construct Jsonp request without JsonpClientModule installed.'
                )
              return new w(e => {
                const n = this.xhrFactory.build()
                if (
                  (n.open(t.method, t.urlWithParams),
                  t.withCredentials && (n.withCredentials = !0),
                  t.headers.forEach((t, e) =>
                    n.setRequestHeader(t, e.join(','))
                  ),
                  t.headers.has('Accept') ||
                    n.setRequestHeader(
                      'Accept',
                      'application/json, text/plain, */*'
                    ),
                  !t.headers.has('Content-Type'))
                ) {
                  const e = t.detectContentTypeHeader()
                  null !== e && n.setRequestHeader('Content-Type', e)
                }
                if (t.responseType) {
                  const e = t.responseType.toLowerCase()
                  n.responseType = 'json' !== e ? e : 'text'
                }
                const r = t.serializeBody()
                let s = null
                const i = () => {
                    if (null !== s) return s
                    const e = 1223 === n.status ? 204 : n.status,
                      r = n.statusText || 'OK',
                      i = new vf(n.getAllResponseHeaders()),
                      o =
                        (function (t) {
                          return 'responseURL' in t && t.responseURL
                            ? t.responseURL
                            : /^X-Request-URL:/m.test(t.getAllResponseHeaders())
                            ? t.getResponseHeader('X-Request-URL')
                            : null
                        })(n) || t.url
                    return (
                      (s = new Af({
                        headers: i,
                        status: e,
                        statusText: r,
                        url: o
                      })),
                      s
                    )
                  },
                  o = () => {
                    let { headers: r, status: s, statusText: o, url: a } = i(),
                      l = null
                    204 !== s &&
                      (l = void 0 === n.response ? n.responseText : n.response),
                      0 === s && (s = l ? 200 : 0)
                    let u = s >= 200 && s < 300
                    if ('json' === t.responseType && 'string' == typeof l) {
                      const t = l
                      l = l.replace(Vf, '')
                      try {
                        l = '' !== l ? JSON.parse(l) : null
                      } catch (c) {
                        ;(l = t), u && ((u = !1), (l = { error: c, text: l }))
                      }
                    }
                    u
                      ? (e.next(
                          new Of({
                            body: l,
                            headers: r,
                            status: s,
                            statusText: o,
                            url: a || void 0
                          })
                        ),
                        e.complete())
                      : e.error(
                          new If({
                            error: l,
                            headers: r,
                            status: s,
                            statusText: o,
                            url: a || void 0
                          })
                        )
                  },
                  a = t => {
                    const { url: r } = i(),
                      s = new If({
                        error: t,
                        status: n.status || 0,
                        statusText: n.statusText || 'Unknown Error',
                        url: r || void 0
                      })
                    e.error(s)
                  }
                let l = !1
                const u = r => {
                    l || (e.next(i()), (l = !0))
                    let s = { type: Tf.DownloadProgress, loaded: r.loaded }
                    r.lengthComputable && (s.total = r.total),
                      'text' === t.responseType &&
                        n.responseText &&
                        (s.partialText = n.responseText),
                      e.next(s)
                  },
                  c = t => {
                    let n = { type: Tf.UploadProgress, loaded: t.loaded }
                    t.lengthComputable && (n.total = t.total), e.next(n)
                  }
                return (
                  n.addEventListener('load', o),
                  n.addEventListener('error', a),
                  t.reportProgress &&
                    (n.addEventListener('progress', u),
                    null !== r &&
                      n.upload &&
                      n.upload.addEventListener('progress', c)),
                  n.send(r),
                  e.next({ type: Tf.Sent }),
                  () => {
                    n.removeEventListener('error', a),
                      n.removeEventListener('load', o),
                      t.reportProgress &&
                        (n.removeEventListener('progress', u),
                        null !== r &&
                          n.upload &&
                          n.upload.removeEventListener('progress', c)),
                      n.abort()
                  }
                )
              })
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Wt(jf))
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })()
      const Lf = new jt('XSRF_COOKIE_NAME'),
        $f = new jt('XSRF_HEADER_NAME')
      class Hf {}
      let Gf = (() => {
          class t {
            constructor (t, e, n) {
              ;(this.doc = t),
                (this.platform = e),
                (this.cookieName = n),
                (this.lastCookieString = ''),
                (this.lastToken = null),
                (this.parseCount = 0)
            }
            getToken () {
              if ('server' === this.platform) return null
              const t = this.doc.cookie || ''
              return (
                t !== this.lastCookieString &&
                  (this.parseCount++,
                  (this.lastToken = zu(t, this.cookieName)),
                  (this.lastCookieString = t)),
                this.lastToken
              )
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Wt(Zl), Wt(Ja), Wt(Lf))
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })(),
        zf = (() => {
          class t {
            constructor (t, e) {
              ;(this.tokenService = t), (this.headerName = e)
            }
            intercept (t, e) {
              const n = t.url.toLowerCase()
              if (
                'GET' === t.method ||
                'HEAD' === t.method ||
                n.startsWith('http://') ||
                n.startsWith('https://')
              )
                return e.handle(t)
              const r = this.tokenService.getToken()
              return (
                null === r ||
                  t.headers.has(this.headerName) ||
                  (t = t.clone({ headers: t.headers.set(this.headerName, r) })),
                e.handle(t)
              )
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Wt(Hf), Wt($f))
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })(),
        qf = (() => {
          class t {
            constructor (t, e) {
              ;(this.backend = t), (this.injector = e), (this.chain = null)
            }
            handle (t) {
              if (null === this.chain) {
                const t = this.injector.get(Nf, [])
                this.chain = t.reduceRight((t, e) => new Rf(t, e), this.backend)
              }
              return this.chain.handle(t)
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Wt(yf), Wt(di))
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })(),
        Bf = (() => {
          class t {
            static disable () {
              return { ngModule: t, providers: [{ provide: zf, useClass: Df }] }
            }
            static withOptions (e = {}) {
              return {
                ngModule: t,
                providers: [
                  e.cookieName ? { provide: Lf, useValue: e.cookieName } : [],
                  e.headerName ? { provide: $f, useValue: e.headerName } : []
                ]
              }
            }
          }
          return (
            (t.ɵmod = fe({ type: t })),
            (t.ɵinj = ct({
              factory: function (e) {
                return new (e || t)()
              },
              providers: [
                zf,
                { provide: Nf, useExisting: zf, multi: !0 },
                { provide: Hf, useClass: Gf },
                { provide: Lf, useValue: 'XSRF-TOKEN' },
                { provide: $f, useValue: 'X-XSRF-TOKEN' }
              ]
            })),
            t
          )
        })(),
        Wf = (() => {
          class t {}
          return (
            (t.ɵmod = fe({ type: t })),
            (t.ɵinj = ct({
              factory: function (e) {
                return new (e || t)()
              },
              providers: [
                Pf,
                { provide: mf, useClass: qf },
                Uf,
                { provide: yf, useExisting: Uf },
                Ff,
                { provide: jf, useExisting: Ff }
              ],
              imports: [
                [
                  Bf.withOptions({
                    cookieName: 'XSRF-TOKEN',
                    headerName: 'X-XSRF-TOKEN'
                  })
                ]
              ]
            })),
            t
          )
        })(),
        Zf = (() => {
          class t {
            constructor (t) {
              ;(this.http = t), (this.url = '/api/auth/')
            }
            auth (t, e) {
              return this.http.post(this.url + 'login', {
                username: t,
                password: e,
                realm: 2
              })
            }
            recovery (t) {
              return this.http.post(this.url + 'recovery', { access_token: t })
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Wt(Pf))
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })()
      function Qf (t, e) {
        return new w(n => {
          const r = t.length
          if (0 === r) return void n.complete()
          const s = new Array(r)
          let i = 0,
            o = 0
          for (let a = 0; a < r; a++) {
            const l = $(t[a])
            let u = !1
            n.add(
              l.subscribe({
                next: t => {
                  u || ((u = !0), o++), (s[a] = t)
                },
                error: t => n.error(t),
                complete: () => {
                  i++,
                    (i !== r && u) ||
                      (o === r &&
                        n.next(
                          e ? e.reduce((t, e, n) => ((t[e] = s[n]), t), {}) : s
                        ),
                      n.complete())
                }
              })
            )
          }
        })
      }
      const Jf = new jt('NgValueAccessor'),
        Kf = { provide: Jf, useExisting: Ct(() => Yf), multi: !0 }
      let Yf = (() => {
        class t {
          constructor (t, e) {
            ;(this._renderer = t),
              (this._elementRef = e),
              (this.onChange = t => {}),
              (this.onTouched = () => {})
          }
          writeValue (t) {
            this._renderer.setProperty(
              this._elementRef.nativeElement,
              'checked',
              t
            )
          }
          registerOnChange (t) {
            this.onChange = t
          }
          registerOnTouched (t) {
            this.onTouched = t
          }
          setDisabledState (t) {
            this._renderer.setProperty(
              this._elementRef.nativeElement,
              'disabled',
              t
            )
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Pi(Ro), Pi(Oo))
          }),
          (t.ɵdir = me({
            type: t,
            selectors: [
              ['input', 'type', 'checkbox', 'formControlName', ''],
              ['input', 'type', 'checkbox', 'formControl', ''],
              ['input', 'type', 'checkbox', 'ngModel', '']
            ],
            hostBindings: function (t, e) {
              1 & t &&
                Hi('change', function (t) {
                  return e.onChange(t.target.checked)
                })('blur', function () {
                  return e.onTouched()
                })
            },
            features: [Eo([Kf])]
          })),
          t
        )
      })()
      const Xf = { provide: Jf, useExisting: Ct(() => eg), multi: !0 },
        tg = new jt('CompositionEventMode')
      let eg = (() => {
          class t {
            constructor (t, e, n) {
              ;(this._renderer = t),
                (this._elementRef = e),
                (this._compositionMode = n),
                (this.onChange = t => {}),
                (this.onTouched = () => {}),
                (this._composing = !1),
                null == this._compositionMode &&
                  (this._compositionMode = !(function () {
                    const t = Wl() ? Wl().getUserAgent() : ''
                    return /android (\d+)/.test(t.toLowerCase())
                  })())
            }
            writeValue (t) {
              this._renderer.setProperty(
                this._elementRef.nativeElement,
                'value',
                null == t ? '' : t
              )
            }
            registerOnChange (t) {
              this.onChange = t
            }
            registerOnTouched (t) {
              this.onTouched = t
            }
            setDisabledState (t) {
              this._renderer.setProperty(
                this._elementRef.nativeElement,
                'disabled',
                t
              )
            }
            _handleInput (t) {
              ;(!this._compositionMode ||
                (this._compositionMode && !this._composing)) &&
                this.onChange(t)
            }
            _compositionStart () {
              this._composing = !0
            }
            _compositionEnd (t) {
              ;(this._composing = !1), this._compositionMode && this.onChange(t)
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Pi(Ro), Pi(Oo), Pi(tg, 8))
            }),
            (t.ɵdir = me({
              type: t,
              selectors: [
                ['input', 'formControlName', '', 3, 'type', 'checkbox'],
                ['textarea', 'formControlName', ''],
                ['input', 'formControl', '', 3, 'type', 'checkbox'],
                ['textarea', 'formControl', ''],
                ['input', 'ngModel', '', 3, 'type', 'checkbox'],
                ['textarea', 'ngModel', ''],
                ['', 'ngDefaultControl', '']
              ],
              hostBindings: function (t, e) {
                1 & t &&
                  Hi('input', function (t) {
                    return e._handleInput(t.target.value)
                  })('blur', function () {
                    return e.onTouched()
                  })('compositionstart', function () {
                    return e._compositionStart()
                  })('compositionend', function (t) {
                    return e._compositionEnd(t.target.value)
                  })
              },
              features: [Eo([Xf])]
            })),
            t
          )
        })(),
        ng = (() => {
          class t {
            get value () {
              return this.control ? this.control.value : null
            }
            get valid () {
              return this.control ? this.control.valid : null
            }
            get invalid () {
              return this.control ? this.control.invalid : null
            }
            get pending () {
              return this.control ? this.control.pending : null
            }
            get disabled () {
              return this.control ? this.control.disabled : null
            }
            get enabled () {
              return this.control ? this.control.enabled : null
            }
            get errors () {
              return this.control ? this.control.errors : null
            }
            get pristine () {
              return this.control ? this.control.pristine : null
            }
            get dirty () {
              return this.control ? this.control.dirty : null
            }
            get touched () {
              return this.control ? this.control.touched : null
            }
            get status () {
              return this.control ? this.control.status : null
            }
            get untouched () {
              return this.control ? this.control.untouched : null
            }
            get statusChanges () {
              return this.control ? this.control.statusChanges : null
            }
            get valueChanges () {
              return this.control ? this.control.valueChanges : null
            }
            get path () {
              return null
            }
            reset (t) {
              this.control && this.control.reset(t)
            }
            hasError (t, e) {
              return !!this.control && this.control.hasError(t, e)
            }
            getError (t, e) {
              return this.control ? this.control.getError(t, e) : null
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)()
            }),
            (t.ɵdir = me({ type: t })),
            t
          )
        })(),
        rg = (() => {
          class t extends ng {
            get formDirective () {
              return null
            }
            get path () {
              return null
            }
          }
          return (
            (t.ɵfac = function (e) {
              return sg(e || t)
            }),
            (t.ɵdir = me({ type: t, features: [lo] })),
            t
          )
        })()
      const sg = Yn(rg)
      function ig () {
        throw new Error('unimplemented')
      }
      class og extends ng {
        constructor () {
          super(...arguments),
            (this._parent = null),
            (this.name = null),
            (this.valueAccessor = null),
            (this._rawValidators = []),
            (this._rawAsyncValidators = [])
        }
        get validator () {
          return ig()
        }
        get asyncValidator () {
          return ig()
        }
      }
      class ag {
        constructor (t) {
          this._cd = t
        }
        get ngClassUntouched () {
          return !!this._cd.control && this._cd.control.untouched
        }
        get ngClassTouched () {
          return !!this._cd.control && this._cd.control.touched
        }
        get ngClassPristine () {
          return !!this._cd.control && this._cd.control.pristine
        }
        get ngClassDirty () {
          return !!this._cd.control && this._cd.control.dirty
        }
        get ngClassValid () {
          return !!this._cd.control && this._cd.control.valid
        }
        get ngClassInvalid () {
          return !!this._cd.control && this._cd.control.invalid
        }
        get ngClassPending () {
          return !!this._cd.control && this._cd.control.pending
        }
      }
      let lg = (() => {
          class t extends ag {
            constructor (t) {
              super(t)
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Pi(og, 2))
            }),
            (t.ɵdir = me({
              type: t,
              selectors: [
                ['', 'formControlName', ''],
                ['', 'ngModel', ''],
                ['', 'formControl', '']
              ],
              hostVars: 14,
              hostBindings: function (t, e) {
                2 & t &&
                  Yi('ng-untouched', e.ngClassUntouched)(
                    'ng-touched',
                    e.ngClassTouched
                  )('ng-pristine', e.ngClassPristine)(
                    'ng-dirty',
                    e.ngClassDirty
                  )('ng-valid', e.ngClassValid)('ng-invalid', e.ngClassInvalid)(
                    'ng-pending',
                    e.ngClassPending
                  )
              },
              features: [lo]
            })),
            t
          )
        })(),
        ug = (() => {
          class t extends ag {
            constructor (t) {
              super(t)
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Pi(rg, 2))
            }),
            (t.ɵdir = me({
              type: t,
              selectors: [
                ['', 'formGroupName', ''],
                ['', 'formArrayName', ''],
                ['', 'ngModelGroup', ''],
                ['', 'formGroup', ''],
                ['form', 3, 'ngNoForm', ''],
                ['', 'ngForm', '']
              ],
              hostVars: 14,
              hostBindings: function (t, e) {
                2 & t &&
                  Yi('ng-untouched', e.ngClassUntouched)(
                    'ng-touched',
                    e.ngClassTouched
                  )('ng-pristine', e.ngClassPristine)(
                    'ng-dirty',
                    e.ngClassDirty
                  )('ng-valid', e.ngClassValid)('ng-invalid', e.ngClassInvalid)(
                    'ng-pending',
                    e.ngClassPending
                  )
              },
              features: [lo]
            })),
            t
          )
        })()
      function cg (t) {
        return null == t || 0 === t.length
      }
      const hg = new jt('NgValidators'),
        dg = new jt('NgAsyncValidators'),
        pg =
          /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      class fg {
        static min (t) {
          return e => {
            if (cg(e.value) || cg(t)) return null
            const n = parseFloat(e.value)
            return !isNaN(n) && n < t
              ? { min: { min: t, actual: e.value } }
              : null
          }
        }
        static max (t) {
          return e => {
            if (cg(e.value) || cg(t)) return null
            const n = parseFloat(e.value)
            return !isNaN(n) && n > t
              ? { max: { max: t, actual: e.value } }
              : null
          }
        }
        static required (t) {
          return cg(t.value) ? { required: !0 } : null
        }
        static requiredTrue (t) {
          return !0 === t.value ? null : { required: !0 }
        }
        static email (t) {
          return cg(t.value) ? null : pg.test(t.value) ? null : { email: !0 }
        }
        static minLength (t) {
          return e => {
            if (cg(e.value)) return null
            const n = e.value ? e.value.length : 0
            return n < t
              ? { minlength: { requiredLength: t, actualLength: n } }
              : null
          }
        }
        static maxLength (t) {
          return e => {
            const n = e.value ? e.value.length : 0
            return n > t
              ? { maxlength: { requiredLength: t, actualLength: n } }
              : null
          }
        }
        static pattern (t) {
          if (!t) return fg.nullValidator
          let e, n
          return (
            'string' == typeof t
              ? ((n = ''),
                '^' !== t.charAt(0) && (n += '^'),
                (n += t),
                '$' !== t.charAt(t.length - 1) && (n += '$'),
                (e = new RegExp(n)))
              : ((n = t.toString()), (e = t)),
            t => {
              if (cg(t.value)) return null
              const r = t.value
              return e.test(r)
                ? null
                : { pattern: { requiredPattern: n, actualValue: r } }
            }
          )
        }
        static nullValidator (t) {
          return null
        }
        static compose (t) {
          if (!t) return null
          const e = t.filter(gg)
          return 0 == e.length
            ? null
            : function (t) {
                return yg(
                  (function (t, e) {
                    return e.map(e => e(t))
                  })(t, e)
                )
              }
        }
        static composeAsync (t) {
          if (!t) return null
          const e = t.filter(gg)
          return 0 == e.length
            ? null
            : function (t) {
                return (function (...t) {
                  if (1 === t.length) {
                    const e = t[0]
                    if (l(e)) return Qf(e, null)
                    if (u(e) && Object.getPrototypeOf(e) === Object.prototype) {
                      const t = Object.keys(e)
                      return Qf(
                        t.map(t => e[t]),
                        t
                      )
                    }
                  }
                  if ('function' == typeof t[t.length - 1]) {
                    const e = t.pop()
                    return Qf(
                      (t = 1 === t.length && l(t[0]) ? t[0] : t),
                      null
                    ).pipe(j(t => e(...t)))
                  }
                  return Qf(t, null)
                })(
                  (function (t, e) {
                    return e.map(e => e(t))
                  })(t, e).map(mg)
                ).pipe(j(yg))
              }
        }
      }
      function gg (t) {
        return null != t
      }
      function mg (t) {
        const e = Li(t) ? $(t) : t
        if (!$i(e))
          throw new Error('Expected validator to return Promise or Observable.')
        return e
      }
      function yg (t) {
        let e = {}
        return (
          t.forEach(t => {
            e = null != t ? Object.assign(Object.assign({}, e), t) : e
          }),
          0 === Object.keys(e).length ? null : e
        )
      }
      function vg (t) {
        return t.validate ? e => t.validate(e) : t
      }
      function _g (t) {
        return t.validate ? e => t.validate(e) : t
      }
      const wg = { provide: Jf, useExisting: Ct(() => bg), multi: !0 }
      let bg = (() => {
        class t {
          constructor (t, e) {
            ;(this._renderer = t),
              (this._elementRef = e),
              (this.onChange = t => {}),
              (this.onTouched = () => {})
          }
          writeValue (t) {
            this._renderer.setProperty(
              this._elementRef.nativeElement,
              'value',
              null == t ? '' : t
            )
          }
          registerOnChange (t) {
            this.onChange = e => {
              t('' == e ? null : parseFloat(e))
            }
          }
          registerOnTouched (t) {
            this.onTouched = t
          }
          setDisabledState (t) {
            this._renderer.setProperty(
              this._elementRef.nativeElement,
              'disabled',
              t
            )
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Pi(Ro), Pi(Oo))
          }),
          (t.ɵdir = me({
            type: t,
            selectors: [
              ['input', 'type', 'number', 'formControlName', ''],
              ['input', 'type', 'number', 'formControl', ''],
              ['input', 'type', 'number', 'ngModel', '']
            ],
            hostBindings: function (t, e) {
              1 & t &&
                Hi('change', function (t) {
                  return e.onChange(t.target.value)
                })('input', function (t) {
                  return e.onChange(t.target.value)
                })('blur', function () {
                  return e.onTouched()
                })
            },
            features: [Eo([wg])]
          })),
          t
        )
      })()
      const Cg = { provide: Jf, useExisting: Ct(() => xg), multi: !0 }
      let Sg = (() => {
          class t {
            constructor () {
              this._accessors = []
            }
            add (t, e) {
              this._accessors.push([t, e])
            }
            remove (t) {
              for (let e = this._accessors.length - 1; e >= 0; --e)
                if (this._accessors[e][1] === t)
                  return void this._accessors.splice(e, 1)
            }
            select (t) {
              this._accessors.forEach(e => {
                this._isSameGroup(e, t) &&
                  e[1] !== t &&
                  e[1].fireUncheck(t.value)
              })
            }
            _isSameGroup (t, e) {
              return (
                !!t[0].control &&
                t[0]._parent === e._control._parent &&
                t[1].name === e.name
              )
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)()
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })(),
        xg = (() => {
          class t {
            constructor (t, e, n, r) {
              ;(this._renderer = t),
                (this._elementRef = e),
                (this._registry = n),
                (this._injector = r),
                (this.onChange = () => {}),
                (this.onTouched = () => {})
            }
            ngOnInit () {
              ;(this._control = this._injector.get(og)),
                this._checkName(),
                this._registry.add(this._control, this)
            }
            ngOnDestroy () {
              this._registry.remove(this)
            }
            writeValue (t) {
              ;(this._state = t === this.value),
                this._renderer.setProperty(
                  this._elementRef.nativeElement,
                  'checked',
                  this._state
                )
            }
            registerOnChange (t) {
              ;(this._fn = t),
                (this.onChange = () => {
                  t(this.value), this._registry.select(this)
                })
            }
            fireUncheck (t) {
              this.writeValue(t)
            }
            registerOnTouched (t) {
              this.onTouched = t
            }
            setDisabledState (t) {
              this._renderer.setProperty(
                this._elementRef.nativeElement,
                'disabled',
                t
              )
            }
            _checkName () {
              this.name &&
                this.formControlName &&
                this.name !== this.formControlName &&
                this._throwNameError(),
                !this.name &&
                  this.formControlName &&
                  (this.name = this.formControlName)
            }
            _throwNameError () {
              throw new Error(
                '\n      If you define both a name and a formControlName attribute on your radio button, their values\n      must match. Ex: <input type="radio" formControlName="food" name="food">\n    '
              )
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Pi(Ro), Pi(Oo), Pi(Sg), Pi(di))
            }),
            (t.ɵdir = me({
              type: t,
              selectors: [
                ['input', 'type', 'radio', 'formControlName', ''],
                ['input', 'type', 'radio', 'formControl', ''],
                ['input', 'type', 'radio', 'ngModel', '']
              ],
              hostBindings: function (t, e) {
                1 & t &&
                  Hi('change', function () {
                    return e.onChange()
                  })('blur', function () {
                    return e.onTouched()
                  })
              },
              inputs: {
                name: 'name',
                formControlName: 'formControlName',
                value: 'value'
              },
              features: [Eo([Cg])]
            })),
            t
          )
        })()
      const Eg = { provide: Jf, useExisting: Ct(() => Tg), multi: !0 }
      let Tg = (() => {
        class t {
          constructor (t, e) {
            ;(this._renderer = t),
              (this._elementRef = e),
              (this.onChange = t => {}),
              (this.onTouched = () => {})
          }
          writeValue (t) {
            this._renderer.setProperty(
              this._elementRef.nativeElement,
              'value',
              parseFloat(t)
            )
          }
          registerOnChange (t) {
            this.onChange = e => {
              t('' == e ? null : parseFloat(e))
            }
          }
          registerOnTouched (t) {
            this.onTouched = t
          }
          setDisabledState (t) {
            this._renderer.setProperty(
              this._elementRef.nativeElement,
              'disabled',
              t
            )
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Pi(Ro), Pi(Oo))
          }),
          (t.ɵdir = me({
            type: t,
            selectors: [
              ['input', 'type', 'range', 'formControlName', ''],
              ['input', 'type', 'range', 'formControl', ''],
              ['input', 'type', 'range', 'ngModel', '']
            ],
            hostBindings: function (t, e) {
              1 & t &&
                Hi('change', function (t) {
                  return e.onChange(t.target.value)
                })('input', function (t) {
                  return e.onChange(t.target.value)
                })('blur', function () {
                  return e.onTouched()
                })
            },
            features: [Eo([Eg])]
          })),
          t
        )
      })()
      const kg =
          '\n    <div [formGroup]="myGroup">\n      <input formControlName="firstName">\n    </div>\n\n    In your class:\n\n    this.myGroup = new FormGroup({\n       firstName: new FormControl()\n    });',
        Ag =
          '\n    <div [formGroup]="myGroup">\n       <div formGroupName="person">\n          <input formControlName="firstName">\n       </div>\n    </div>\n\n    In your class:\n\n    this.myGroup = new FormGroup({\n       person: new FormGroup({ firstName: new FormControl() })\n    });',
        Og =
          '\n    <form>\n       <div ngModelGroup="person">\n          <input [(ngModel)]="person.name" name="firstName">\n       </div>\n    </form>'
      class Ig {
        static controlParentException () {
          throw new Error(
            `formControlName must be used with a parent formGroup directive.  You'll want to add a formGroup\n       directive and pass it an existing FormGroup instance (you can create one in your class).\n\n      Example:\n\n      ${kg}`
          )
        }
        static ngModelGroupException () {
          throw new Error(
            `formControlName cannot be used with an ngModelGroup parent. It is only compatible with parents\n       that also have a "form" prefix: formGroupName, formArrayName, or formGroup.\n\n       Option 1:  Update the parent to be formGroupName (reactive form strategy)\n\n        ${Ag}\n\n        Option 2: Use ngModel instead of formControlName (template-driven strategy)\n\n        ${Og}`
          )
        }
        static missingFormException () {
          throw new Error(
            `formGroup expects a FormGroup instance. Please pass one in.\n\n       Example:\n\n       ${kg}`
          )
        }
        static groupParentException () {
          throw new Error(
            `formGroupName must be used with a parent formGroup directive.  You'll want to add a formGroup\n      directive and pass it an existing FormGroup instance (you can create one in your class).\n\n      Example:\n\n      ${Ag}`
          )
        }
        static arrayParentException () {
          throw new Error(
            'formArrayName must be used with a parent formGroup directive.  You\'ll want to add a formGroup\n       directive and pass it an existing FormGroup instance (you can create one in your class).\n\n        Example:\n\n        \n    <div [formGroup]="myGroup">\n      <div formArrayName="cities">\n        <div *ngFor="let city of cityArray.controls; index as i">\n          <input [formControlName]="i">\n        </div>\n      </div>\n    </div>\n\n    In your class:\n\n    this.cityArray = new FormArray([new FormControl(\'SF\')]);\n    this.myGroup = new FormGroup({\n      cities: this.cityArray\n    });'
          )
        }
        static disabledAttrWarning () {
          console.warn(
            "\n      It looks like you're using the disabled attribute with a reactive form directive. If you set disabled to true\n      when you set up this control in your component class, the disabled attribute will actually be set in the DOM for\n      you. We recommend using this approach to avoid 'changed after checked' errors.\n       \n      Example: \n      form = new FormGroup({\n        first: new FormControl({value: 'Nancy', disabled: true}, Validators.required),\n        last: new FormControl('Drew', Validators.required)\n      });\n    "
          )
        }
        static ngModelWarning (t) {
          console.warn(
            `\n    It looks like you're using ngModel on the same form field as ${t}. \n    Support for using the ngModel input property and ngModelChange event with \n    reactive form directives has been deprecated in Angular v6 and will be removed \n    in Angular v7.\n    \n    For more information on this, see our API docs here:\n    https://angular.io/api/forms/${
              'formControl' === t ? 'FormControlDirective' : 'FormControlName'
            }#use-with-ngmodel\n    `
          )
        }
      }
      const Mg = { provide: Jf, useExisting: Ct(() => Rg), multi: !0 }
      function Pg (t, e) {
        return null == t
          ? `${e}`
          : (e && 'object' == typeof e && (e = 'Object'),
            `${t}: ${e}`.slice(0, 50))
      }
      let Rg = (() => {
          class t {
            constructor (t, e) {
              ;(this._renderer = t),
                (this._elementRef = e),
                (this._optionMap = new Map()),
                (this._idCounter = 0),
                (this.onChange = t => {}),
                (this.onTouched = () => {}),
                (this._compareWith = wi)
            }
            set compareWith (t) {
              if ('function' != typeof t)
                throw new Error(
                  `compareWith must be a function, but received ${JSON.stringify(
                    t
                  )}`
                )
              this._compareWith = t
            }
            writeValue (t) {
              this.value = t
              const e = this._getOptionId(t)
              null == e &&
                this._renderer.setProperty(
                  this._elementRef.nativeElement,
                  'selectedIndex',
                  -1
                )
              const n = Pg(e, t)
              this._renderer.setProperty(
                this._elementRef.nativeElement,
                'value',
                n
              )
            }
            registerOnChange (t) {
              this.onChange = e => {
                ;(this.value = this._getOptionValue(e)), t(this.value)
              }
            }
            registerOnTouched (t) {
              this.onTouched = t
            }
            setDisabledState (t) {
              this._renderer.setProperty(
                this._elementRef.nativeElement,
                'disabled',
                t
              )
            }
            _registerOption () {
              return (this._idCounter++).toString()
            }
            _getOptionId (t) {
              for (const e of Array.from(this._optionMap.keys()))
                if (this._compareWith(this._optionMap.get(e), t)) return e
              return null
            }
            _getOptionValue (t) {
              const e = (function (t) {
                return t.split(':')[0]
              })(t)
              return this._optionMap.has(e) ? this._optionMap.get(e) : t
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Pi(Ro), Pi(Oo))
            }),
            (t.ɵdir = me({
              type: t,
              selectors: [
                ['select', 'formControlName', '', 3, 'multiple', ''],
                ['select', 'formControl', '', 3, 'multiple', ''],
                ['select', 'ngModel', '', 3, 'multiple', '']
              ],
              hostBindings: function (t, e) {
                1 & t &&
                  Hi('change', function (t) {
                    return e.onChange(t.target.value)
                  })('blur', function () {
                    return e.onTouched()
                  })
              },
              inputs: { compareWith: 'compareWith' },
              features: [Eo([Mg])]
            })),
            t
          )
        })(),
        Ng = (() => {
          class t {
            constructor (t, e, n) {
              ;(this._element = t),
                (this._renderer = e),
                (this._select = n),
                this._select && (this.id = this._select._registerOption())
            }
            set ngValue (t) {
              null != this._select &&
                (this._select._optionMap.set(this.id, t),
                this._setElementValue(Pg(this.id, t)),
                this._select.writeValue(this._select.value))
            }
            set value (t) {
              this._setElementValue(t),
                this._select && this._select.writeValue(this._select.value)
            }
            _setElementValue (t) {
              this._renderer.setProperty(
                this._element.nativeElement,
                'value',
                t
              )
            }
            ngOnDestroy () {
              this._select &&
                (this._select._optionMap.delete(this.id),
                this._select.writeValue(this._select.value))
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Pi(Oo), Pi(Ro), Pi(Rg, 9))
            }),
            (t.ɵdir = me({
              type: t,
              selectors: [['option']],
              inputs: { ngValue: 'ngValue', value: 'value' }
            })),
            t
          )
        })()
      const Dg = { provide: Jf, useExisting: Ct(() => jg), multi: !0 }
      function Vg (t, e) {
        return null == t
          ? `${e}`
          : ('string' == typeof e && (e = `'${e}'`),
            e && 'object' == typeof e && (e = 'Object'),
            `${t}: ${e}`.slice(0, 50))
      }
      let jg = (() => {
          class t {
            constructor (t, e) {
              ;(this._renderer = t),
                (this._elementRef = e),
                (this._optionMap = new Map()),
                (this._idCounter = 0),
                (this.onChange = t => {}),
                (this.onTouched = () => {}),
                (this._compareWith = wi)
            }
            set compareWith (t) {
              if ('function' != typeof t)
                throw new Error(
                  `compareWith must be a function, but received ${JSON.stringify(
                    t
                  )}`
                )
              this._compareWith = t
            }
            writeValue (t) {
              let e
              if (((this.value = t), Array.isArray(t))) {
                const n = t.map(t => this._getOptionId(t))
                e = (t, e) => {
                  t._setSelected(n.indexOf(e.toString()) > -1)
                }
              } else
                e = (t, e) => {
                  t._setSelected(!1)
                }
              this._optionMap.forEach(e)
            }
            registerOnChange (t) {
              this.onChange = e => {
                const n = []
                if (e.hasOwnProperty('selectedOptions')) {
                  const t = e.selectedOptions
                  for (let e = 0; e < t.length; e++) {
                    const r = t.item(e),
                      s = this._getOptionValue(r.value)
                    n.push(s)
                  }
                } else {
                  const t = e.options
                  for (let e = 0; e < t.length; e++) {
                    const r = t.item(e)
                    if (r.selected) {
                      const t = this._getOptionValue(r.value)
                      n.push(t)
                    }
                  }
                }
                ;(this.value = n), t(n)
              }
            }
            registerOnTouched (t) {
              this.onTouched = t
            }
            setDisabledState (t) {
              this._renderer.setProperty(
                this._elementRef.nativeElement,
                'disabled',
                t
              )
            }
            _registerOption (t) {
              const e = (this._idCounter++).toString()
              return this._optionMap.set(e, t), e
            }
            _getOptionId (t) {
              for (const e of Array.from(this._optionMap.keys()))
                if (this._compareWith(this._optionMap.get(e)._value, t))
                  return e
              return null
            }
            _getOptionValue (t) {
              const e = (function (t) {
                return t.split(':')[0]
              })(t)
              return this._optionMap.has(e) ? this._optionMap.get(e)._value : t
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Pi(Ro), Pi(Oo))
            }),
            (t.ɵdir = me({
              type: t,
              selectors: [
                ['select', 'multiple', '', 'formControlName', ''],
                ['select', 'multiple', '', 'formControl', ''],
                ['select', 'multiple', '', 'ngModel', '']
              ],
              hostBindings: function (t, e) {
                1 & t &&
                  Hi('change', function (t) {
                    return e.onChange(t.target)
                  })('blur', function () {
                    return e.onTouched()
                  })
              },
              inputs: { compareWith: 'compareWith' },
              features: [Eo([Dg])]
            })),
            t
          )
        })(),
        Fg = (() => {
          class t {
            constructor (t, e, n) {
              ;(this._element = t),
                (this._renderer = e),
                (this._select = n),
                this._select && (this.id = this._select._registerOption(this))
            }
            set ngValue (t) {
              null != this._select &&
                ((this._value = t),
                this._setElementValue(Vg(this.id, t)),
                this._select.writeValue(this._select.value))
            }
            set value (t) {
              this._select
                ? ((this._value = t),
                  this._setElementValue(Vg(this.id, t)),
                  this._select.writeValue(this._select.value))
                : this._setElementValue(t)
            }
            _setElementValue (t) {
              this._renderer.setProperty(
                this._element.nativeElement,
                'value',
                t
              )
            }
            _setSelected (t) {
              this._renderer.setProperty(
                this._element.nativeElement,
                'selected',
                t
              )
            }
            ngOnDestroy () {
              this._select &&
                (this._select._optionMap.delete(this.id),
                this._select.writeValue(this._select.value))
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Pi(Oo), Pi(Ro), Pi(jg, 9))
            }),
            (t.ɵdir = me({
              type: t,
              selectors: [['option']],
              inputs: { ngValue: 'ngValue', value: 'value' }
            })),
            t
          )
        })()
      function Ug (t, e) {
        return [...e.path, t]
      }
      function Lg (t, e) {
        t || zg(e, 'Cannot find control with'),
          e.valueAccessor || zg(e, 'No value accessor for form control with'),
          (t.validator = fg.compose([t.validator, e.validator])),
          (t.asyncValidator = fg.composeAsync([
            t.asyncValidator,
            e.asyncValidator
          ])),
          e.valueAccessor.writeValue(t.value),
          (function (t, e) {
            e.valueAccessor.registerOnChange(n => {
              ;(t._pendingValue = n),
                (t._pendingChange = !0),
                (t._pendingDirty = !0),
                'change' === t.updateOn && $g(t, e)
            })
          })(t, e),
          (function (t, e) {
            t.registerOnChange((t, n) => {
              e.valueAccessor.writeValue(t), n && e.viewToModelUpdate(t)
            })
          })(t, e),
          (function (t, e) {
            e.valueAccessor.registerOnTouched(() => {
              ;(t._pendingTouched = !0),
                'blur' === t.updateOn && t._pendingChange && $g(t, e),
                'submit' !== t.updateOn && t.markAsTouched()
            })
          })(t, e),
          e.valueAccessor.setDisabledState &&
            t.registerOnDisabledChange(t => {
              e.valueAccessor.setDisabledState(t)
            }),
          e._rawValidators.forEach(e => {
            e.registerOnValidatorChange &&
              e.registerOnValidatorChange(() => t.updateValueAndValidity())
          }),
          e._rawAsyncValidators.forEach(e => {
            e.registerOnValidatorChange &&
              e.registerOnValidatorChange(() => t.updateValueAndValidity())
          })
      }
      function $g (t, e) {
        t._pendingDirty && t.markAsDirty(),
          t.setValue(t._pendingValue, { emitModelToViewChange: !1 }),
          e.viewToModelUpdate(t._pendingValue),
          (t._pendingChange = !1)
      }
      function Hg (t, e) {
        null == t && zg(e, 'Cannot find control with'),
          (t.validator = fg.compose([t.validator, e.validator])),
          (t.asyncValidator = fg.composeAsync([
            t.asyncValidator,
            e.asyncValidator
          ]))
      }
      function Gg (t) {
        return zg(
          t,
          'There is no FormControl instance attached to form control element with'
        )
      }
      function zg (t, e) {
        let n
        throw (
          ((n =
            t.path.length > 1
              ? `path: '${t.path.join(' -> ')}'`
              : t.path[0]
              ? `name: '${t.path}'`
              : 'unspecified name attribute'),
          new Error(`${e} ${n}`))
        )
      }
      function qg (t) {
        return null != t ? fg.compose(t.map(vg)) : null
      }
      function Bg (t) {
        return null != t ? fg.composeAsync(t.map(_g)) : null
      }
      function Wg (t, e) {
        if (!t.hasOwnProperty('model')) return !1
        const n = t.model
        return !!n.isFirstChange() || !wi(e, n.currentValue)
      }
      const Zg = [Yf, Tg, bg, Rg, jg, xg]
      function Qg (t, e) {
        t._syncPendingControls(),
          e.forEach(t => {
            const e = t.control
            'submit' === e.updateOn &&
              e._pendingChange &&
              (t.viewToModelUpdate(e._pendingValue), (e._pendingChange = !1))
          })
      }
      function Jg (t, e) {
        if (!e) return null
        Array.isArray(e) ||
          zg(
            t,
            'Value accessor was not provided as an array for form control with'
          )
        let n = void 0,
          r = void 0,
          s = void 0
        return (
          e.forEach(e => {
            var i
            e.constructor === eg
              ? (n = e)
              : ((i = e),
                Zg.some(t => i.constructor === t)
                  ? (r &&
                      zg(
                        t,
                        'More than one built-in value accessor matches form control with'
                      ),
                    (r = e))
                  : (s &&
                      zg(
                        t,
                        'More than one custom value accessor matches form control with'
                      ),
                    (s = e)))
          }),
          s ||
            r ||
            n ||
            (zg(t, 'No valid value accessor for form control with'), null)
        )
      }
      function Kg (t, e) {
        const n = t.indexOf(e)
        n > -1 && t.splice(n, 1)
      }
      function Yg (t) {
        const e = tm(t) ? t.validators : t
        return Array.isArray(e) ? qg(e) : e || null
      }
      function Xg (t, e) {
        const n = tm(e) ? e.asyncValidators : t
        return Array.isArray(n) ? Bg(n) : n || null
      }
      function tm (t) {
        return null != t && !Array.isArray(t) && 'object' == typeof t
      }
      class em {
        constructor (t, e) {
          ;(this.validator = t),
            (this.asyncValidator = e),
            (this._onCollectionChange = () => {}),
            (this.pristine = !0),
            (this.touched = !1),
            (this._onDisabledChange = [])
        }
        get parent () {
          return this._parent
        }
        get valid () {
          return 'VALID' === this.status
        }
        get invalid () {
          return 'INVALID' === this.status
        }
        get pending () {
          return 'PENDING' == this.status
        }
        get disabled () {
          return 'DISABLED' === this.status
        }
        get enabled () {
          return 'DISABLED' !== this.status
        }
        get dirty () {
          return !this.pristine
        }
        get untouched () {
          return !this.touched
        }
        get updateOn () {
          return this._updateOn
            ? this._updateOn
            : this.parent
            ? this.parent.updateOn
            : 'change'
        }
        setValidators (t) {
          this.validator = Yg(t)
        }
        setAsyncValidators (t) {
          this.asyncValidator = Xg(t)
        }
        clearValidators () {
          this.validator = null
        }
        clearAsyncValidators () {
          this.asyncValidator = null
        }
        markAsTouched (t = {}) {
          ;(this.touched = !0),
            this._parent && !t.onlySelf && this._parent.markAsTouched(t)
        }
        markAllAsTouched () {
          this.markAsTouched({ onlySelf: !0 }),
            this._forEachChild(t => t.markAllAsTouched())
        }
        markAsUntouched (t = {}) {
          ;(this.touched = !1),
            (this._pendingTouched = !1),
            this._forEachChild(t => {
              t.markAsUntouched({ onlySelf: !0 })
            }),
            this._parent && !t.onlySelf && this._parent._updateTouched(t)
        }
        markAsDirty (t = {}) {
          ;(this.pristine = !1),
            this._parent && !t.onlySelf && this._parent.markAsDirty(t)
        }
        markAsPristine (t = {}) {
          ;(this.pristine = !0),
            (this._pendingDirty = !1),
            this._forEachChild(t => {
              t.markAsPristine({ onlySelf: !0 })
            }),
            this._parent && !t.onlySelf && this._parent._updatePristine(t)
        }
        markAsPending (t = {}) {
          ;(this.status = 'PENDING'),
            !1 !== t.emitEvent && this.statusChanges.emit(this.status),
            this._parent && !t.onlySelf && this._parent.markAsPending(t)
        }
        disable (t = {}) {
          const e = this._parentMarkedDirty(t.onlySelf)
          ;(this.status = 'DISABLED'),
            (this.errors = null),
            this._forEachChild(e => {
              e.disable(Object.assign(Object.assign({}, t), { onlySelf: !0 }))
            }),
            this._updateValue(),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._updateAncestors(
              Object.assign(Object.assign({}, t), { skipPristineCheck: e })
            ),
            this._onDisabledChange.forEach(t => t(!0))
        }
        enable (t = {}) {
          const e = this._parentMarkedDirty(t.onlySelf)
          ;(this.status = 'VALID'),
            this._forEachChild(e => {
              e.enable(Object.assign(Object.assign({}, t), { onlySelf: !0 }))
            }),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent
            }),
            this._updateAncestors(
              Object.assign(Object.assign({}, t), { skipPristineCheck: e })
            ),
            this._onDisabledChange.forEach(t => t(!1))
        }
        _updateAncestors (t) {
          this._parent &&
            !t.onlySelf &&
            (this._parent.updateValueAndValidity(t),
            t.skipPristineCheck || this._parent._updatePristine(),
            this._parent._updateTouched())
        }
        setParent (t) {
          this._parent = t
        }
        updateValueAndValidity (t = {}) {
          this._setInitialStatus(),
            this._updateValue(),
            this.enabled &&
              (this._cancelExistingSubscription(),
              (this.errors = this._runValidator()),
              (this.status = this._calculateStatus()),
              ('VALID' !== this.status && 'PENDING' !== this.status) ||
                this._runAsyncValidator(t.emitEvent)),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._parent &&
              !t.onlySelf &&
              this._parent.updateValueAndValidity(t)
        }
        _updateTreeValidity (t = { emitEvent: !0 }) {
          this._forEachChild(e => e._updateTreeValidity(t)),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent
            })
        }
        _setInitialStatus () {
          this.status = this._allControlsDisabled() ? 'DISABLED' : 'VALID'
        }
        _runValidator () {
          return this.validator ? this.validator(this) : null
        }
        _runAsyncValidator (t) {
          if (this.asyncValidator) {
            this.status = 'PENDING'
            const e = mg(this.asyncValidator(this))
            this._asyncValidationSubscription = e.subscribe(e =>
              this.setErrors(e, { emitEvent: t })
            )
          }
        }
        _cancelExistingSubscription () {
          this._asyncValidationSubscription &&
            this._asyncValidationSubscription.unsubscribe()
        }
        setErrors (t, e = {}) {
          ;(this.errors = t), this._updateControlsErrors(!1 !== e.emitEvent)
        }
        get (t) {
          return (function (t, e, n) {
            if (null == e) return null
            if (
              (Array.isArray(e) || (e = e.split('.')),
              Array.isArray(e) && 0 === e.length)
            )
              return null
            let r = t
            return (
              e.forEach(t => {
                r =
                  r instanceof rm
                    ? r.controls.hasOwnProperty(t)
                      ? r.controls[t]
                      : null
                    : (r instanceof sm && r.at(t)) || null
              }),
              r
            )
          })(this, t)
        }
        getError (t, e) {
          const n = e ? this.get(e) : this
          return n && n.errors ? n.errors[t] : null
        }
        hasError (t, e) {
          return !!this.getError(t, e)
        }
        get root () {
          let t = this
          for (; t._parent; ) t = t._parent
          return t
        }
        _updateControlsErrors (t) {
          ;(this.status = this._calculateStatus()),
            t && this.statusChanges.emit(this.status),
            this._parent && this._parent._updateControlsErrors(t)
        }
        _initObservables () {
          ;(this.valueChanges = new Aa()), (this.statusChanges = new Aa())
        }
        _calculateStatus () {
          return this._allControlsDisabled()
            ? 'DISABLED'
            : this.errors
            ? 'INVALID'
            : this._anyControlsHaveStatus('PENDING')
            ? 'PENDING'
            : this._anyControlsHaveStatus('INVALID')
            ? 'INVALID'
            : 'VALID'
        }
        _anyControlsHaveStatus (t) {
          return this._anyControls(e => e.status === t)
        }
        _anyControlsDirty () {
          return this._anyControls(t => t.dirty)
        }
        _anyControlsTouched () {
          return this._anyControls(t => t.touched)
        }
        _updatePristine (t = {}) {
          ;(this.pristine = !this._anyControlsDirty()),
            this._parent && !t.onlySelf && this._parent._updatePristine(t)
        }
        _updateTouched (t = {}) {
          ;(this.touched = this._anyControlsTouched()),
            this._parent && !t.onlySelf && this._parent._updateTouched(t)
        }
        _isBoxedValue (t) {
          return (
            'object' == typeof t &&
            null !== t &&
            2 === Object.keys(t).length &&
            'value' in t &&
            'disabled' in t
          )
        }
        _registerOnCollectionChange (t) {
          this._onCollectionChange = t
        }
        _setUpdateStrategy (t) {
          tm(t) && null != t.updateOn && (this._updateOn = t.updateOn)
        }
        _parentMarkedDirty (t) {
          return (
            !t &&
            this._parent &&
            this._parent.dirty &&
            !this._parent._anyControlsDirty()
          )
        }
      }
      class nm extends em {
        constructor (t = null, e, n) {
          super(Yg(e), Xg(n, e)),
            (this._onChange = []),
            this._applyFormState(t),
            this._setUpdateStrategy(e),
            this.updateValueAndValidity({ onlySelf: !0, emitEvent: !1 }),
            this._initObservables()
        }
        setValue (t, e = {}) {
          ;(this.value = this._pendingValue = t),
            this._onChange.length &&
              !1 !== e.emitModelToViewChange &&
              this._onChange.forEach(t =>
                t(this.value, !1 !== e.emitViewToModelChange)
              ),
            this.updateValueAndValidity(e)
        }
        patchValue (t, e = {}) {
          this.setValue(t, e)
        }
        reset (t = null, e = {}) {
          this._applyFormState(t),
            this.markAsPristine(e),
            this.markAsUntouched(e),
            this.setValue(this.value, e),
            (this._pendingChange = !1)
        }
        _updateValue () {}
        _anyControls (t) {
          return !1
        }
        _allControlsDisabled () {
          return this.disabled
        }
        registerOnChange (t) {
          this._onChange.push(t)
        }
        _clearChangeFns () {
          ;(this._onChange = []),
            (this._onDisabledChange = []),
            (this._onCollectionChange = () => {})
        }
        registerOnDisabledChange (t) {
          this._onDisabledChange.push(t)
        }
        _forEachChild (t) {}
        _syncPendingControls () {
          return !(
            'submit' !== this.updateOn ||
            (this._pendingDirty && this.markAsDirty(),
            this._pendingTouched && this.markAsTouched(),
            !this._pendingChange) ||
            (this.setValue(this._pendingValue, {
              onlySelf: !0,
              emitModelToViewChange: !1
            }),
            0)
          )
        }
        _applyFormState (t) {
          this._isBoxedValue(t)
            ? ((this.value = this._pendingValue = t.value),
              t.disabled
                ? this.disable({ onlySelf: !0, emitEvent: !1 })
                : this.enable({ onlySelf: !0, emitEvent: !1 }))
            : (this.value = this._pendingValue = t)
        }
      }
      class rm extends em {
        constructor (t, e, n) {
          super(Yg(e), Xg(n, e)),
            (this.controls = t),
            this._initObservables(),
            this._setUpdateStrategy(e),
            this._setUpControls(),
            this.updateValueAndValidity({ onlySelf: !0, emitEvent: !1 })
        }
        registerControl (t, e) {
          return this.controls[t]
            ? this.controls[t]
            : ((this.controls[t] = e),
              e.setParent(this),
              e._registerOnCollectionChange(this._onCollectionChange),
              e)
        }
        addControl (t, e) {
          this.registerControl(t, e),
            this.updateValueAndValidity(),
            this._onCollectionChange()
        }
        removeControl (t) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            delete this.controls[t],
            this.updateValueAndValidity(),
            this._onCollectionChange()
        }
        setControl (t, e) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            delete this.controls[t],
            e && this.registerControl(t, e),
            this.updateValueAndValidity(),
            this._onCollectionChange()
        }
        contains (t) {
          return this.controls.hasOwnProperty(t) && this.controls[t].enabled
        }
        setValue (t, e = {}) {
          this._checkAllValuesPresent(t),
            Object.keys(t).forEach(n => {
              this._throwIfControlMissing(n),
                this.controls[n].setValue(t[n], {
                  onlySelf: !0,
                  emitEvent: e.emitEvent
                })
            }),
            this.updateValueAndValidity(e)
        }
        patchValue (t, e = {}) {
          Object.keys(t).forEach(n => {
            this.controls[n] &&
              this.controls[n].patchValue(t[n], {
                onlySelf: !0,
                emitEvent: e.emitEvent
              })
          }),
            this.updateValueAndValidity(e)
        }
        reset (t = {}, e = {}) {
          this._forEachChild((n, r) => {
            n.reset(t[r], { onlySelf: !0, emitEvent: e.emitEvent })
          }),
            this._updatePristine(e),
            this._updateTouched(e),
            this.updateValueAndValidity(e)
        }
        getRawValue () {
          return this._reduceChildren(
            {},
            (t, e, n) => (
              (t[n] = e instanceof nm ? e.value : e.getRawValue()), t
            )
          )
        }
        _syncPendingControls () {
          let t = this._reduceChildren(
            !1,
            (t, e) => !!e._syncPendingControls() || t
          )
          return t && this.updateValueAndValidity({ onlySelf: !0 }), t
        }
        _throwIfControlMissing (t) {
          if (!Object.keys(this.controls).length)
            throw new Error(
              "\n        There are no form controls registered with this group yet.  If you're using ngModel,\n        you may want to check next tick (e.g. use setTimeout).\n      "
            )
          if (!this.controls[t])
            throw new Error(`Cannot find form control with name: ${t}.`)
        }
        _forEachChild (t) {
          Object.keys(this.controls).forEach(e => t(this.controls[e], e))
        }
        _setUpControls () {
          this._forEachChild(t => {
            t.setParent(this),
              t._registerOnCollectionChange(this._onCollectionChange)
          })
        }
        _updateValue () {
          this.value = this._reduceValue()
        }
        _anyControls (t) {
          let e = !1
          return (
            this._forEachChild((n, r) => {
              e = e || (this.contains(r) && t(n))
            }),
            e
          )
        }
        _reduceValue () {
          return this._reduceChildren(
            {},
            (t, e, n) => ((e.enabled || this.disabled) && (t[n] = e.value), t)
          )
        }
        _reduceChildren (t, e) {
          let n = t
          return (
            this._forEachChild((t, r) => {
              n = e(n, t, r)
            }),
            n
          )
        }
        _allControlsDisabled () {
          for (const t of Object.keys(this.controls))
            if (this.controls[t].enabled) return !1
          return Object.keys(this.controls).length > 0 || this.disabled
        }
        _checkAllValuesPresent (t) {
          this._forEachChild((e, n) => {
            if (void 0 === t[n])
              throw new Error(
                `Must supply a value for form control with name: '${n}'.`
              )
          })
        }
      }
      class sm extends em {
        constructor (t, e, n) {
          super(Yg(e), Xg(n, e)),
            (this.controls = t),
            this._initObservables(),
            this._setUpdateStrategy(e),
            this._setUpControls(),
            this.updateValueAndValidity({ onlySelf: !0, emitEvent: !1 })
        }
        at (t) {
          return this.controls[t]
        }
        push (t) {
          this.controls.push(t),
            this._registerControl(t),
            this.updateValueAndValidity(),
            this._onCollectionChange()
        }
        insert (t, e) {
          this.controls.splice(t, 0, e),
            this._registerControl(e),
            this.updateValueAndValidity()
        }
        removeAt (t) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            this.controls.splice(t, 1),
            this.updateValueAndValidity()
        }
        setControl (t, e) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            this.controls.splice(t, 1),
            e && (this.controls.splice(t, 0, e), this._registerControl(e)),
            this.updateValueAndValidity(),
            this._onCollectionChange()
        }
        get length () {
          return this.controls.length
        }
        setValue (t, e = {}) {
          this._checkAllValuesPresent(t),
            t.forEach((t, n) => {
              this._throwIfControlMissing(n),
                this.at(n).setValue(t, { onlySelf: !0, emitEvent: e.emitEvent })
            }),
            this.updateValueAndValidity(e)
        }
        patchValue (t, e = {}) {
          t.forEach((t, n) => {
            this.at(n) &&
              this.at(n).patchValue(t, { onlySelf: !0, emitEvent: e.emitEvent })
          }),
            this.updateValueAndValidity(e)
        }
        reset (t = [], e = {}) {
          this._forEachChild((n, r) => {
            n.reset(t[r], { onlySelf: !0, emitEvent: e.emitEvent })
          }),
            this._updatePristine(e),
            this._updateTouched(e),
            this.updateValueAndValidity(e)
        }
        getRawValue () {
          return this.controls.map(t =>
            t instanceof nm ? t.value : t.getRawValue()
          )
        }
        clear () {
          this.controls.length < 1 ||
            (this._forEachChild(t => t._registerOnCollectionChange(() => {})),
            this.controls.splice(0),
            this.updateValueAndValidity())
        }
        _syncPendingControls () {
          let t = this.controls.reduce(
            (t, e) => !!e._syncPendingControls() || t,
            !1
          )
          return t && this.updateValueAndValidity({ onlySelf: !0 }), t
        }
        _throwIfControlMissing (t) {
          if (!this.controls.length)
            throw new Error(
              "\n        There are no form controls registered with this array yet.  If you're using ngModel,\n        you may want to check next tick (e.g. use setTimeout).\n      "
            )
          if (!this.at(t))
            throw new Error(`Cannot find form control at index ${t}`)
        }
        _forEachChild (t) {
          this.controls.forEach((e, n) => {
            t(e, n)
          })
        }
        _updateValue () {
          this.value = this.controls
            .filter(t => t.enabled || this.disabled)
            .map(t => t.value)
        }
        _anyControls (t) {
          return this.controls.some(e => e.enabled && t(e))
        }
        _setUpControls () {
          this._forEachChild(t => this._registerControl(t))
        }
        _checkAllValuesPresent (t) {
          this._forEachChild((e, n) => {
            if (void 0 === t[n])
              throw new Error(
                `Must supply a value for form control at index: ${n}.`
              )
          })
        }
        _allControlsDisabled () {
          for (const t of this.controls) if (t.enabled) return !1
          return this.controls.length > 0 || this.disabled
        }
        _registerControl (t) {
          t.setParent(this),
            t._registerOnCollectionChange(this._onCollectionChange)
        }
      }
      const im = { provide: rg, useExisting: Ct(() => am) },
        om = (() => Promise.resolve(null))()
      let am = (() => {
          class t extends rg {
            constructor (t, e) {
              super(),
                (this.submitted = !1),
                (this._directives = []),
                (this.ngSubmit = new Aa()),
                (this.form = new rm({}, qg(t), Bg(e)))
            }
            ngAfterViewInit () {
              this._setUpdateStrategy()
            }
            get formDirective () {
              return this
            }
            get control () {
              return this.form
            }
            get path () {
              return []
            }
            get controls () {
              return this.form.controls
            }
            addControl (t) {
              om.then(() => {
                const e = this._findContainer(t.path)
                ;(t.control = e.registerControl(t.name, t.control)),
                  Lg(t.control, t),
                  t.control.updateValueAndValidity({ emitEvent: !1 }),
                  this._directives.push(t)
              })
            }
            getControl (t) {
              return this.form.get(t.path)
            }
            removeControl (t) {
              om.then(() => {
                const e = this._findContainer(t.path)
                e && e.removeControl(t.name), Kg(this._directives, t)
              })
            }
            addFormGroup (t) {
              om.then(() => {
                const e = this._findContainer(t.path),
                  n = new rm({})
                Hg(n, t),
                  e.registerControl(t.name, n),
                  n.updateValueAndValidity({ emitEvent: !1 })
              })
            }
            removeFormGroup (t) {
              om.then(() => {
                const e = this._findContainer(t.path)
                e && e.removeControl(t.name)
              })
            }
            getFormGroup (t) {
              return this.form.get(t.path)
            }
            updateModel (t, e) {
              om.then(() => {
                this.form.get(t.path).setValue(e)
              })
            }
            setValue (t) {
              this.control.setValue(t)
            }
            onSubmit (t) {
              return (
                (this.submitted = !0),
                Qg(this.form, this._directives),
                this.ngSubmit.emit(t),
                !1
              )
            }
            onReset () {
              this.resetForm()
            }
            resetForm (t) {
              this.form.reset(t), (this.submitted = !1)
            }
            _setUpdateStrategy () {
              this.options &&
                null != this.options.updateOn &&
                (this.form._updateOn = this.options.updateOn)
            }
            _findContainer (t) {
              return t.pop(), t.length ? this.form.get(t) : this.form
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Pi(hg, 10), Pi(dg, 10))
            }),
            (t.ɵdir = me({
              type: t,
              selectors: [
                ['form', 3, 'ngNoForm', '', 3, 'formGroup', ''],
                ['ng-form'],
                ['', 'ngForm', '']
              ],
              hostBindings: function (t, e) {
                1 & t &&
                  Hi('submit', function (t) {
                    return e.onSubmit(t)
                  })('reset', function () {
                    return e.onReset()
                  })
              },
              inputs: { options: ['ngFormOptions', 'options'] },
              outputs: { ngSubmit: 'ngSubmit' },
              exportAs: ['ngForm'],
              features: [Eo([im]), lo]
            })),
            t
          )
        })(),
        lm = (() => {
          class t extends rg {
            ngOnInit () {
              this._checkParentType(), this.formDirective.addFormGroup(this)
            }
            ngOnDestroy () {
              this.formDirective && this.formDirective.removeFormGroup(this)
            }
            get control () {
              return this.formDirective.getFormGroup(this)
            }
            get path () {
              return Ug(
                null == this.name ? this.name : this.name.toString(),
                this._parent
              )
            }
            get formDirective () {
              return this._parent ? this._parent.formDirective : null
            }
            get validator () {
              return qg(this._validators)
            }
            get asyncValidator () {
              return Bg(this._asyncValidators)
            }
            _checkParentType () {}
          }
          return (
            (t.ɵfac = function (e) {
              return um(e || t)
            }),
            (t.ɵdir = me({ type: t, features: [lo] })),
            t
          )
        })()
      const um = Yn(lm)
      class cm {
        static modelParentException () {
          throw new Error(
            `\n      ngModel cannot be used to register form controls with a parent formGroup directive.  Try using\n      formGroup's partner directive "formControlName" instead.  Example:\n\n      ${kg}\n\n      Or, if you'd like to avoid registering this form control, indicate that it's standalone in ngModelOptions:\n\n      Example:\n\n      \n    <div [formGroup]="myGroup">\n       <input formControlName="firstName">\n       <input [(ngModel)]="showMoreControls" [ngModelOptions]="{standalone: true}">\n    </div>\n  `
          )
        }
        static formGroupNameException () {
          throw new Error(
            `\n      ngModel cannot be used to register form controls with a parent formGroupName or formArrayName directive.\n\n      Option 1: Use formControlName instead of ngModel (reactive strategy):\n\n      ${Ag}\n\n      Option 2:  Update ngModel's parent be ngModelGroup (template-driven strategy):\n\n      ${Og}`
          )
        }
        static missingNameException () {
          throw new Error(
            'If ngModel is used within a form tag, either the name attribute must be set or the form\n      control must be defined as \'standalone\' in ngModelOptions.\n\n      Example 1: <input [(ngModel)]="person.firstName" name="first">\n      Example 2: <input [(ngModel)]="person.firstName" [ngModelOptions]="{standalone: true}">'
          )
        }
        static modelGroupParentException () {
          throw new Error(
            `\n      ngModelGroup cannot be used with a parent formGroup directive.\n\n      Option 1: Use formGroupName instead of ngModelGroup (reactive strategy):\n\n      ${Ag}\n\n      Option 2:  Use a regular form tag instead of the formGroup directive (template-driven strategy):\n\n      ${Og}`
          )
        }
      }
      const hm = { provide: rg, useExisting: Ct(() => dm) }
      let dm = (() => {
        class t extends lm {
          constructor (t, e, n) {
            super(),
              (this._parent = t),
              (this._validators = e),
              (this._asyncValidators = n)
          }
          _checkParentType () {
            this._parent instanceof t ||
              this._parent instanceof am ||
              cm.modelGroupParentException()
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Pi(rg, 5), Pi(hg, 10), Pi(dg, 10))
          }),
          (t.ɵdir = me({
            type: t,
            selectors: [['', 'ngModelGroup', '']],
            inputs: { name: ['ngModelGroup', 'name'] },
            exportAs: ['ngModelGroup'],
            features: [Eo([hm]), lo]
          })),
          t
        )
      })()
      const pm = { provide: og, useExisting: Ct(() => gm) },
        fm = (() => Promise.resolve(null))()
      let gm = (() => {
          class t extends og {
            constructor (t, e, n, r) {
              super(),
                (this.control = new nm()),
                (this._registered = !1),
                (this.update = new Aa()),
                (this._parent = t),
                (this._rawValidators = e || []),
                (this._rawAsyncValidators = n || []),
                (this.valueAccessor = Jg(this, r))
            }
            ngOnChanges (t) {
              this._checkForErrors(),
                this._registered || this._setUpControl(),
                'isDisabled' in t && this._updateDisabled(t),
                Wg(t, this.viewModel) &&
                  (this._updateValue(this.model), (this.viewModel = this.model))
            }
            ngOnDestroy () {
              this.formDirective && this.formDirective.removeControl(this)
            }
            get path () {
              return this._parent ? Ug(this.name, this._parent) : [this.name]
            }
            get formDirective () {
              return this._parent ? this._parent.formDirective : null
            }
            get validator () {
              return qg(this._rawValidators)
            }
            get asyncValidator () {
              return Bg(this._rawAsyncValidators)
            }
            viewToModelUpdate (t) {
              ;(this.viewModel = t), this.update.emit(t)
            }
            _setUpControl () {
              this._setUpdateStrategy(),
                this._isStandalone()
                  ? this._setUpStandalone()
                  : this.formDirective.addControl(this),
                (this._registered = !0)
            }
            _setUpdateStrategy () {
              this.options &&
                null != this.options.updateOn &&
                (this.control._updateOn = this.options.updateOn)
            }
            _isStandalone () {
              return (
                !this._parent || !(!this.options || !this.options.standalone)
              )
            }
            _setUpStandalone () {
              Lg(this.control, this),
                this.control.updateValueAndValidity({ emitEvent: !1 })
            }
            _checkForErrors () {
              this._isStandalone() || this._checkParentType(), this._checkName()
            }
            _checkParentType () {
              !(this._parent instanceof dm) && this._parent instanceof lm
                ? cm.formGroupNameException()
                : this._parent instanceof dm ||
                  this._parent instanceof am ||
                  cm.modelParentException()
            }
            _checkName () {
              this.options &&
                this.options.name &&
                (this.name = this.options.name),
                this._isStandalone() || this.name || cm.missingNameException()
            }
            _updateValue (t) {
              fm.then(() => {
                this.control.setValue(t, { emitViewToModelChange: !1 })
              })
            }
            _updateDisabled (t) {
              const e = t.isDisabled.currentValue,
                n = '' === e || (e && 'false' !== e)
              fm.then(() => {
                n && !this.control.disabled
                  ? this.control.disable()
                  : !n && this.control.disabled && this.control.enable()
              })
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Pi(rg, 9), Pi(hg, 10), Pi(dg, 10), Pi(Jf, 10))
            }),
            (t.ɵdir = me({
              type: t,
              selectors: [
                [
                  '',
                  'ngModel',
                  '',
                  3,
                  'formControlName',
                  '',
                  3,
                  'formControl',
                  ''
                ]
              ],
              inputs: {
                name: 'name',
                isDisabled: ['disabled', 'isDisabled'],
                model: ['ngModel', 'model'],
                options: ['ngModelOptions', 'options']
              },
              outputs: { update: 'ngModelChange' },
              exportAs: ['ngModel'],
              features: [Eo([pm]), lo, go]
            })),
            t
          )
        })(),
        mm = (() => {
          class t {}
          return (
            (t.ɵfac = function (e) {
              return new (e || t)()
            }),
            (t.ɵdir = me({
              type: t,
              selectors: [
                ['form', 3, 'ngNoForm', '', 3, 'ngNativeValidate', '']
              ],
              hostAttrs: ['novalidate', '']
            })),
            t
          )
        })()
      const ym = new jt('NgModelWithFormControlWarning'),
        vm = { provide: rg, useExisting: Ct(() => _m) }
      let _m = (() => {
        class t extends rg {
          constructor (t, e) {
            super(),
              (this._validators = t),
              (this._asyncValidators = e),
              (this.submitted = !1),
              (this.directives = []),
              (this.form = null),
              (this.ngSubmit = new Aa())
          }
          ngOnChanges (t) {
            this._checkFormPresent(),
              t.hasOwnProperty('form') &&
                (this._updateValidators(),
                this._updateDomValue(),
                this._updateRegistrations())
          }
          get formDirective () {
            return this
          }
          get control () {
            return this.form
          }
          get path () {
            return []
          }
          addControl (t) {
            const e = this.form.get(t.path)
            return (
              Lg(e, t),
              e.updateValueAndValidity({ emitEvent: !1 }),
              this.directives.push(t),
              e
            )
          }
          getControl (t) {
            return this.form.get(t.path)
          }
          removeControl (t) {
            Kg(this.directives, t)
          }
          addFormGroup (t) {
            const e = this.form.get(t.path)
            Hg(e, t), e.updateValueAndValidity({ emitEvent: !1 })
          }
          removeFormGroup (t) {}
          getFormGroup (t) {
            return this.form.get(t.path)
          }
          addFormArray (t) {
            const e = this.form.get(t.path)
            Hg(e, t), e.updateValueAndValidity({ emitEvent: !1 })
          }
          removeFormArray (t) {}
          getFormArray (t) {
            return this.form.get(t.path)
          }
          updateModel (t, e) {
            this.form.get(t.path).setValue(e)
          }
          onSubmit (t) {
            return (
              (this.submitted = !0),
              Qg(this.form, this.directives),
              this.ngSubmit.emit(t),
              !1
            )
          }
          onReset () {
            this.resetForm()
          }
          resetForm (t) {
            this.form.reset(t), (this.submitted = !1)
          }
          _updateDomValue () {
            this.directives.forEach(t => {
              const e = this.form.get(t.path)
              t.control !== e &&
                ((function (t, e) {
                  e.valueAccessor.registerOnChange(() => Gg(e)),
                    e.valueAccessor.registerOnTouched(() => Gg(e)),
                    e._rawValidators.forEach(t => {
                      t.registerOnValidatorChange &&
                        t.registerOnValidatorChange(null)
                    }),
                    e._rawAsyncValidators.forEach(t => {
                      t.registerOnValidatorChange &&
                        t.registerOnValidatorChange(null)
                    }),
                    t && t._clearChangeFns()
                })(t.control, t),
                e && Lg(e, t),
                (t.control = e))
            }),
              this.form._updateTreeValidity({ emitEvent: !1 })
          }
          _updateRegistrations () {
            this.form._registerOnCollectionChange(() => this._updateDomValue()),
              this._oldForm &&
                this._oldForm._registerOnCollectionChange(() => {}),
              (this._oldForm = this.form)
          }
          _updateValidators () {
            const t = qg(this._validators)
            this.form.validator = fg.compose([this.form.validator, t])
            const e = Bg(this._asyncValidators)
            this.form.asyncValidator = fg.composeAsync([
              this.form.asyncValidator,
              e
            ])
          }
          _checkFormPresent () {
            this.form || Ig.missingFormException()
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Pi(hg, 10), Pi(dg, 10))
          }),
          (t.ɵdir = me({
            type: t,
            selectors: [['', 'formGroup', '']],
            hostBindings: function (t, e) {
              1 & t &&
                Hi('submit', function (t) {
                  return e.onSubmit(t)
                })('reset', function () {
                  return e.onReset()
                })
            },
            inputs: { form: ['formGroup', 'form'] },
            outputs: { ngSubmit: 'ngSubmit' },
            exportAs: ['ngForm'],
            features: [Eo([vm]), lo, go]
          })),
          t
        )
      })()
      const wm = { provide: rg, useExisting: Ct(() => bm) }
      let bm = (() => {
        class t extends lm {
          constructor (t, e, n) {
            super(),
              (this._parent = t),
              (this._validators = e),
              (this._asyncValidators = n)
          }
          _checkParentType () {
            xm(this._parent) && Ig.groupParentException()
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Pi(rg, 13), Pi(hg, 10), Pi(dg, 10))
          }),
          (t.ɵdir = me({
            type: t,
            selectors: [['', 'formGroupName', '']],
            inputs: { name: ['formGroupName', 'name'] },
            features: [Eo([wm]), lo]
          })),
          t
        )
      })()
      const Cm = { provide: rg, useExisting: Ct(() => Sm) }
      let Sm = (() => {
        class t extends rg {
          constructor (t, e, n) {
            super(),
              (this._parent = t),
              (this._validators = e),
              (this._asyncValidators = n)
          }
          ngOnInit () {
            this._checkParentType(), this.formDirective.addFormArray(this)
          }
          ngOnDestroy () {
            this.formDirective && this.formDirective.removeFormArray(this)
          }
          get control () {
            return this.formDirective.getFormArray(this)
          }
          get formDirective () {
            return this._parent ? this._parent.formDirective : null
          }
          get path () {
            return Ug(
              null == this.name ? this.name : this.name.toString(),
              this._parent
            )
          }
          get validator () {
            return qg(this._validators)
          }
          get asyncValidator () {
            return Bg(this._asyncValidators)
          }
          _checkParentType () {
            xm(this._parent) && Ig.arrayParentException()
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Pi(rg, 13), Pi(hg, 10), Pi(dg, 10))
          }),
          (t.ɵdir = me({
            type: t,
            selectors: [['', 'formArrayName', '']],
            inputs: { name: ['formArrayName', 'name'] },
            features: [Eo([Cm]), lo]
          })),
          t
        )
      })()
      function xm (t) {
        return !(t instanceof bm || t instanceof _m || t instanceof Sm)
      }
      const Em = { provide: og, useExisting: Ct(() => Tm) }
      let Tm = (() => {
        class t extends og {
          constructor (t, e, n, r, s) {
            super(),
              (this._ngModelWarningConfig = s),
              (this._added = !1),
              (this.update = new Aa()),
              (this._ngModelWarningSent = !1),
              (this._parent = t),
              (this._rawValidators = e || []),
              (this._rawAsyncValidators = n || []),
              (this.valueAccessor = Jg(this, r))
          }
          set isDisabled (t) {
            Ig.disabledAttrWarning()
          }
          ngOnChanges (e) {
            var n, r
            this._added || this._setUpControl(),
              Wg(e, this.viewModel) &&
                ('formControlName',
                (n = t),
                this,
                (r = this._ngModelWarningConfig),
                ar() &&
                  'never' !== r &&
                  ((((null !== r && 'once' !== r) ||
                    n._ngModelWarningSentOnce) &&
                    ('always' !== r || this._ngModelWarningSent)) ||
                    (Ig.ngModelWarning('formControlName'),
                    (n._ngModelWarningSentOnce = !0),
                    (this._ngModelWarningSent = !0))),
                (this.viewModel = this.model),
                this.formDirective.updateModel(this, this.model))
          }
          ngOnDestroy () {
            this.formDirective && this.formDirective.removeControl(this)
          }
          viewToModelUpdate (t) {
            ;(this.viewModel = t), this.update.emit(t)
          }
          get path () {
            return Ug(
              null == this.name ? this.name : this.name.toString(),
              this._parent
            )
          }
          get formDirective () {
            return this._parent ? this._parent.formDirective : null
          }
          get validator () {
            return qg(this._rawValidators)
          }
          get asyncValidator () {
            return Bg(this._rawAsyncValidators)
          }
          _checkParentType () {
            !(this._parent instanceof bm) && this._parent instanceof lm
              ? Ig.ngModelGroupException()
              : this._parent instanceof bm ||
                this._parent instanceof _m ||
                this._parent instanceof Sm ||
                Ig.controlParentException()
          }
          _setUpControl () {
            this._checkParentType(),
              (this.control = this.formDirective.addControl(this)),
              this.control.disabled &&
                this.valueAccessor.setDisabledState &&
                this.valueAccessor.setDisabledState(!0),
              (this._added = !0)
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(
              Pi(rg, 13),
              Pi(hg, 10),
              Pi(dg, 10),
              Pi(Jf, 10),
              Pi(ym, 8)
            )
          }),
          (t.ɵdir = me({
            type: t,
            selectors: [['', 'formControlName', '']],
            inputs: {
              isDisabled: ['disabled', 'isDisabled'],
              name: ['formControlName', 'name'],
              model: ['ngModel', 'model']
            },
            outputs: { update: 'ngModelChange' },
            features: [Eo([Em]), lo, go]
          })),
          (t._ngModelWarningSentOnce = !1),
          t
        )
      })()
      const km = { provide: hg, useExisting: Ct(() => Am), multi: !0 }
      let Am = (() => {
        class t {
          get required () {
            return this._required
          }
          set required (t) {
            ;(this._required = null != t && !1 !== t && 'false' !== `${t}`),
              this._onChange && this._onChange()
          }
          validate (t) {
            return this.required ? fg.required(t) : null
          }
          registerOnValidatorChange (t) {
            this._onChange = t
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)()
          }),
          (t.ɵdir = me({
            type: t,
            selectors: [
              [
                '',
                'required',
                '',
                'formControlName',
                '',
                3,
                'type',
                'checkbox'
              ],
              ['', 'required', '', 'formControl', '', 3, 'type', 'checkbox'],
              ['', 'required', '', 'ngModel', '', 3, 'type', 'checkbox']
            ],
            hostVars: 1,
            hostBindings: function (t, e) {
              2 & t && ki('required', e.required ? '' : null)
            },
            inputs: { required: 'required' },
            features: [Eo([km])]
          })),
          t
        )
      })()
      const Om = { provide: hg, useExisting: Ct(() => Im), multi: !0 }
      let Im = (() => {
          class t {
            ngOnChanges (t) {
              'pattern' in t &&
                (this._createValidator(), this._onChange && this._onChange())
            }
            validate (t) {
              return this._validator(t)
            }
            registerOnValidatorChange (t) {
              this._onChange = t
            }
            _createValidator () {
              this._validator = fg.pattern(this.pattern)
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)()
            }),
            (t.ɵdir = me({
              type: t,
              selectors: [
                ['', 'pattern', '', 'formControlName', ''],
                ['', 'pattern', '', 'formControl', ''],
                ['', 'pattern', '', 'ngModel', '']
              ],
              hostVars: 1,
              hostBindings: function (t, e) {
                2 & t && ki('pattern', e.pattern ? e.pattern : null)
              },
              inputs: { pattern: 'pattern' },
              features: [Eo([Om]), go]
            })),
            t
          )
        })(),
        Mm = (() => {
          class t {}
          return (
            (t.ɵmod = fe({ type: t })),
            (t.ɵinj = ct({
              factory: function (e) {
                return new (e || t)()
              }
            })),
            t
          )
        })(),
        Pm = (() => {
          class t {
            group (t, e = null) {
              const n = this._reduceControls(t)
              let r = null,
                s = null,
                i = void 0
              return (
                null != e &&
                  ((function (t) {
                    return (
                      void 0 !== t.asyncValidators ||
                      void 0 !== t.validators ||
                      void 0 !== t.updateOn
                    )
                  })(e)
                    ? ((r = null != e.validators ? e.validators : null),
                      (s =
                        null != e.asyncValidators ? e.asyncValidators : null),
                      (i = null != e.updateOn ? e.updateOn : void 0))
                    : ((r = null != e.validator ? e.validator : null),
                      (s =
                        null != e.asyncValidator ? e.asyncValidator : null))),
                new rm(n, { asyncValidators: s, updateOn: i, validators: r })
              )
            }
            control (t, e, n) {
              return new nm(t, e, n)
            }
            array (t, e, n) {
              const r = t.map(t => this._createControl(t))
              return new sm(r, e, n)
            }
            _reduceControls (t) {
              const e = {}
              return (
                Object.keys(t).forEach(n => {
                  e[n] = this._createControl(t[n])
                }),
                e
              )
            }
            _createControl (t) {
              return t instanceof nm || t instanceof rm || t instanceof sm
                ? t
                : Array.isArray(t)
                ? this.control(
                    t[0],
                    t.length > 1 ? t[1] : null,
                    t.length > 2 ? t[2] : null
                  )
                : this.control(t)
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)()
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })(),
        Rm = (() => {
          class t {}
          return (
            (t.ɵmod = fe({ type: t })),
            (t.ɵinj = ct({
              factory: function (e) {
                return new (e || t)()
              },
              providers: [Sg],
              imports: [Mm]
            })),
            t
          )
        })(),
        Nm = (() => {
          class t {
            static withConfig (e) {
              return {
                ngModule: t,
                providers: [
                  { provide: ym, useValue: e.warnOnNgModelWithFormControl }
                ]
              }
            }
          }
          return (
            (t.ɵmod = fe({ type: t })),
            (t.ɵinj = ct({
              factory: function (e) {
                return new (e || t)()
              },
              providers: [Pm, Sg],
              imports: [Mm]
            })),
            t
          )
        })()
      function Dm (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'a', 13),
            Hi('click', function () {
              return Be(t), qi().recovery()
            }),
            ro(1, 'Recovery Password'),
            ji()
        }
      }
      let Vm = (() => {
          class t {
            constructor (t, e) {
              ;(this.serv = t), (this.router = e)
            }
            ngOnInit () {
              ;(this.login = ''), (this.pass = '')
            }
            onKeydownEvent (t) {
              'Enter' === t.key && this.submit()
            }
            canRecovery () {
              return null !== localStorage.getItem('myAuthToken')
            }
            recovery () {
              const t = localStorage.getItem('myAuthToken')
              this.serv.recovery(t).subscribe(
                t => {
                  console.log('Access Token [' + t.access_token + ']'),
                    localStorage.setItem('myAuthToken', t.access_token),
                    localStorage.setItem('myRole', t.role),
                    this.router.navigate(['profile'])
                },
                t => {
                  alert('Password recovery failed')
                }
              )
            }
            submit () {
              this.serv.auth(this.login, this.pass).subscribe(
                t => {
                  if (
                    (console.log('Access Token [' + t.access_token + ']'),
                    localStorage.setItem('myAuthToken', t.access_token),
                    localStorage.setItem('myRole', t.role),
                    localStorage.setItem('myId', t.user_id),
                    2 == t.realm)
                  )
                    this.router.navigate(['bonus'])
                  else {
                    const t = localStorage.getItem('currGame')
                    t
                      ? (localStorage.setItem('currGame', 'launch'),
                        this.router.navigate([t]))
                      : this.router.navigate(['launch'])
                  }
                },
                t => {
                  let e = t.status
                  401 == e
                    ? alert('Login or password not found')
                    : alert('Error: ' + e)
                }
              )
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Pi(Zf), Pi(Wp))
            }),
            (t.ɵcmp = ce({
              type: t,
              selectors: [['auth']],
              features: [Eo([Zf])],
              decls: 21,
              vars: 4,
              consts: [
                [1, 'jumbotron'],
                [1, 'container'],
                [1, 'row'],
                [1, 'col-md-6', 'offset-md-3'],
                ['href', '/reg', 1, 'pull-right'],
                [1, 'auth-form'],
                [1, 'form-group'],
                [
                  'name',
                  'login',
                  'required',
                  '',
                  1,
                  'form-control',
                  3,
                  'ngModel',
                  'ngModelChange'
                ],
                ['username', 'ngModel'],
                [
                  'name',
                  'pass',
                  'type',
                  'password',
                  'required',
                  '',
                  1,
                  'form-control',
                  3,
                  'ngModel',
                  'ngModelChange',
                  'keydown'
                ],
                ['password', 'ngModel'],
                ['class', 'pull-right', 3, 'click', 4, 'ngIf'],
                [1, 'btn', 'btn-primary', 3, 'disabled', 'click'],
                [1, 'pull-right', 3, 'click']
              ],
              template: function (t, e) {
                if (
                  (1 & t &&
                    (Vi(0, 'div', 0),
                    Vi(1, 'div', 1),
                    Vi(2, 'div', 2),
                    Vi(3, 'div', 3),
                    Vi(4, 'a', 4),
                    ro(5, 'Sign In'),
                    ji(),
                    Vi(6, 'div', 5),
                    Vi(7, 'div', 6),
                    Vi(8, 'label'),
                    ro(9, 'Login'),
                    ji(),
                    Vi(10, 'input', 7, 8),
                    Hi('ngModelChange', function (t) {
                      return (e.login = t)
                    }),
                    ji(),
                    ji(),
                    Vi(12, 'div', 6),
                    Vi(13, 'label'),
                    ro(14, 'Password'),
                    ji(),
                    Vi(15, 'input', 9, 10),
                    Hi('ngModelChange', function (t) {
                      return (e.pass = t)
                    })('keydown', function (t) {
                      return e.onKeydownEvent(t)
                    }),
                    ji(),
                    ji(),
                    Ii(17, Dm, 2, 0, 'a', 11),
                    Vi(18, 'div', 6),
                    Vi(19, 'button', 12),
                    Hi('click', function () {
                      return e.submit()
                    }),
                    ro(20, 'Log In'),
                    ji(),
                    ji(),
                    ji(),
                    ji(),
                    ji(),
                    ji(),
                    ji()),
                  2 & t)
                ) {
                  const t = Mi(11),
                    n = Mi(16)
                  Tr(10),
                    Ni('ngModel', e.login),
                    Tr(5),
                    Ni('ngModel', e.pass),
                    Tr(2),
                    Ni('ngIf', e.canRecovery()),
                    Tr(2),
                    Ni('disabled', t.invalid || n.invalid)
                }
              },
              directives: [eg, Am, lg, gm, Qu],
              styles: ['']
            })),
            t
          )
        })(),
        jm = (() => {
          class t {
            constructor (t) {
              ;(this.http = t), (this.url = '/api/bonus')
            }
            getBonus (t) {
              return this.http.get(this.url + '/' + t)
            }
            activateBonus (t, e) {
              return this.http.put(this.url + '/activate', {
                bonus: t,
                info: e
              })
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Wt(Pf))
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })()
      const Fm = function (t, e) {
        return { correct: t, incorrect: e }
      }
      function Um (t, e) {
        if (
          (1 & t &&
            (Vi(0, 'div'), Vi(1, 'p', 14), ro(2), xa(3, 'date'), ji(), ji()),
          2 & t)
        ) {
          const t = qi(3)
          Tr(1),
            Ni('ngClass', ba(5, Fm, t.once, !t.once)),
            Tr(1),
            so(Ea(3, 2, t.activated, 'dd.MM.yyyy HH:mm'))
        }
      }
      function Lm (t, e) {
        if (
          (1 & t &&
            (Vi(0, 'div'),
            Vi(1, 'p', 14),
            ro(
              2,
              '\u0411\u043e\u043d\u0443\u0441 \u0430\u043a\u0442\u0438\u0432\u0438\u0440\u043e\u0432\u0430\u043d'
            ),
            ji(),
            Ii(3, Um, 4, 8, 'div', 8),
            ji()),
          2 & t)
        ) {
          const t = qi(2)
          Tr(1),
            Ni('ngClass', ba(2, Fm, t.once, !t.once)),
            Tr(2),
            Ni('ngIf', t.activated)
        }
      }
      const $m = function () {
        return { incorrect: !0 }
      }
      function Hm (t, e) {
        1 & t &&
          (Vi(0, 'div'),
          Vi(1, 'p', 14),
          ro(
            2,
            '\u0411\u043e\u043d\u0443\u0441 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d'
          ),
          ji(),
          ji()),
          2 & t &&
            (Tr(1),
            Ni(
              'ngClass',
              (function (t, e, n) {
                const r = Ye() + 1,
                  s = ze()
                return s[r] === xr
                  ? xi(s, r, e())
                  : (function (t, e) {
                      return t[e]
                    })(s, r)
              })(0, $m)
            ))
      }
      function Gm (t, e) {
        if (
          (1 & t &&
            (Vi(0, 'div'),
            Ii(1, Lm, 4, 5, 'div', 8),
            Ii(2, Hm, 3, 2, 'div', 8),
            ji()),
          2 & t)
        ) {
          const t = qi()
          Tr(1),
            Ni('ngIf', t.success && t.activated),
            Tr(1),
            Ni('ngIf', !t.success)
        }
      }
      function zm (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'div', 5),
            Vi(1, 'button', 15),
            Hi('click', function () {
              return Be(t), qi().activate()
            }),
            ro(
              2,
              '\u0410\u043a\u0442\u0438\u0432\u0438\u0440\u043e\u0432\u0430\u0442\u044c'
            ),
            ji(),
            ji()
        }
      }
      let qm = (() => {
          class t {
            constructor (t) {
              this.serv = t
            }
            ngOnInit () {
              ;(this.id = null),
                (this.bonus = ''),
                (this.info = ''),
                (this.phone = ''),
                (this.email = ''),
                (this.done = !1),
                (this.success = !1),
                (this.activated = null),
                (this.once = !1)
            }
            find () {
              ;(this.done = !1),
                (this.once = !1),
                (this.activated = null),
                this.serv.getBonus(this.bonus).subscribe(
                  t => {
                    console.log(t),
                      (this.success = !0),
                      (this.done = !0),
                      (this.id = t.id),
                      (this.activated = t.activated),
                      (this.email = t.email),
                      (this.phone = t.phone),
                      (this.info = t.info)
                  },
                  t => {
                    let e = t.status
                    404 == e
                      ? ((this.success = !1),
                        (this.done = !0),
                        (this.id = null),
                        (this.activated = null),
                        (this.email = ''),
                        (this.phone = ''),
                        (this.info = ''))
                      : alert('Error: ' + e)
                  }
                )
            }
            activate () {
              ;(this.done = !1),
                (this.once = !1),
                this.serv.activateBonus(this.bonus, this.info).subscribe(
                  t => {
                    console.log(t),
                      (this.success = !0),
                      (this.done = !0),
                      (this.activated = t.activated),
                      (this.once = !0)
                  },
                  t => {
                    let e = t.status
                    404 == e
                      ? ((this.success = !1),
                        (this.done = !0),
                        (this.id = null),
                        (this.activated = null),
                        (this.email = ''),
                        (this.phone = ''),
                        (this.info = ''))
                      : alert('Error: ' + e)
                  }
                )
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Pi(jm))
            }),
            (t.ɵcmp = ce({
              type: t,
              selectors: [['app-bonus']],
              features: [Eo([jm])],
              decls: 27,
              vars: 9,
              consts: [
                [1, 'jumbotron'],
                [1, 'container'],
                [1, 'row'],
                [1, 'col-md-6', 'offset-md-3'],
                [1, 'bonus-form'],
                [1, 'form-group'],
                [
                  'name',
                  'bonus',
                  'required',
                  '',
                  'pattern',
                  '[0-9A-F]{16}',
                  1,
                  'form-control',
                  3,
                  'ngModel',
                  'ngModelChange'
                ],
                ['bon', 'ngModel'],
                [4, 'ngIf'],
                [1, 'btn', 'btn-primary', 3, 'disabled', 'click'],
                [
                  'name',
                  'phone',
                  1,
                  'form-control',
                  3,
                  'ngModel',
                  'disabled',
                  'ngModelChange'
                ],
                [
                  'name',
                  'email',
                  1,
                  'form-control',
                  3,
                  'ngModel',
                  'disabled',
                  'ngModelChange'
                ],
                [
                  'name',
                  'info',
                  'pattern',
                  '\\d+',
                  1,
                  'form-control',
                  3,
                  'ngModel',
                  'ngModelChange'
                ],
                ['class', 'form-group', 4, 'ngIf'],
                [3, 'ngClass'],
                [1, 'btn', 'btn-primary', 3, 'click']
              ],
              template: function (t, e) {
                if (
                  (1 & t &&
                    (Vi(0, 'div', 0),
                    Vi(1, 'div', 1),
                    Vi(2, 'div', 2),
                    Vi(3, 'div', 3),
                    Vi(4, 'div', 4),
                    Vi(5, 'div', 5),
                    Vi(6, 'label'),
                    ro(7, '\u0411\u043e\u043d\u0443\u0441'),
                    ji(),
                    Vi(8, 'input', 6, 7),
                    Hi('ngModelChange', function (t) {
                      return (e.bonus = t)
                    }),
                    ji(),
                    ji(),
                    Ii(10, Gm, 3, 2, 'div', 8),
                    Vi(11, 'div', 5),
                    Vi(12, 'button', 9),
                    Hi('click', function () {
                      return e.find()
                    }),
                    ro(13, '\u0418\u0441\u043a\u0430\u0442\u044c'),
                    ji(),
                    ji(),
                    Vi(14, 'div', 5),
                    Vi(15, 'label'),
                    ro(16, '\u0422\u0435\u043b\u0435\u0444\u043e\u043d'),
                    ji(),
                    Vi(17, 'input', 10),
                    Hi('ngModelChange', function (t) {
                      return (e.phone = t)
                    }),
                    ji(),
                    ji(),
                    Vi(18, 'div', 5),
                    Vi(19, 'label'),
                    ro(20, 'EMail'),
                    ji(),
                    Vi(21, 'input', 11),
                    Hi('ngModelChange', function (t) {
                      return (e.email = t)
                    }),
                    ji(),
                    ji(),
                    Vi(22, 'div', 5),
                    Vi(23, 'label'),
                    ro(24, 'ID \u041a\u043b\u0438\u0435\u043d\u0442\u0430'),
                    ji(),
                    Vi(25, 'input', 12),
                    Hi('ngModelChange', function (t) {
                      return (e.info = t)
                    }),
                    ji(),
                    ji(),
                    Ii(26, zm, 3, 0, 'div', 13),
                    ji(),
                    ji(),
                    ji(),
                    ji(),
                    ji()),
                  2 & t)
                ) {
                  const t = Mi(9)
                  Tr(8),
                    Ni('ngModel', e.bonus),
                    Tr(2),
                    Ni('ngIf', e.done),
                    Tr(2),
                    Ni('disabled', t.invalid),
                    Tr(5),
                    Ni('ngModel', e.phone)('disabled', !0),
                    Tr(4),
                    Ni('ngModel', e.email)('disabled', !0),
                    Tr(4),
                    Ni('ngModel', e.info),
                    Tr(1),
                    Ni('ngIf', e.id && e.info)
                }
              },
              directives: [eg, Am, Im, lg, gm, Qu, qu],
              pipes: [tc],
              styles: [
                '.correct[_ngcontent-%COMP%]{color:green}.incorrect[_ngcontent-%COMP%]{color:red}'
              ]
            })),
            t
          )
        })(),
        Bm = (() => {
          class t {
            constructor (t) {
              ;(this.http = t),
                (this.tourn = '/api/tournament'),
                (this.styles = '/api/game/styles'),
                (this.sess = '/api/session'),
                (this.join = '/api/join')
            }
            getTourn (t) {
              return this.http.get(this.tourn + '/id/' + t)
            }
            getStyles () {
              return this.http.get(this.styles)
            }
            getSessions (t) {
              return this.http.get(this.sess + '/tournament/' + t)
            }
            joinToSession (t) {
              return this.http.post(this.join, { session_id: t })
            }
            delSessions (t) {
              return this.http.delete(this.sess + '/' + t)
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Wt(Pf))
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })()
      function Wm (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'h3'),
            Vi(1, 'a', 11),
            Hi('click', function () {
              return Be(t), qi().back()
            }),
            ro(2),
            ji(),
            ji()
        }
        if (2 & t) {
          const t = qi()
          Tr(2), so(t.tourn.title)
        }
      }
      function Zm (t, e) {
        if ((1 & t && (Vi(0, 'option', 15), ro(1), ji()), 2 & t)) {
          const t = e.$implicit
          Ni('value', t.id), Tr(1), io(' ', t.name, ' ')
        }
      }
      function Qm (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'div'),
            Vi(1, 'select', 13),
            Hi('ngModelChange', function (e) {
              return Be(t), (qi().$implicit.style = e)
            })('change', function () {
              Be(t)
              const e = qi().$implicit
              return qi().changeStyle(e)
            }),
            Ii(2, Zm, 2, 2, 'option', 14),
            ji(),
            ji()
        }
        if (2 & t) {
          const t = qi().$implicit,
            e = qi()
          Tr(1),
            Ni('ngModel', t.style),
            Tr(1),
            Ni('ngForOf', e.getStyles(t.game_id))
        }
      }
      function Jm (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'div'),
            Vi(1, 'input', 16),
            Hi('click', function () {
              Be(t)
              const e = qi().$implicit
              return qi().delete(e)
            }),
            ji(),
            ji()
        }
      }
      function Km (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'tr'),
            Vi(1, 'td'),
            ro(2),
            xa(3, 'date'),
            ji(),
            Vi(4, 'td'),
            ro(5),
            ji(),
            Vi(6, 'td'),
            ro(7),
            ji(),
            Vi(8, 'td'),
            ro(9),
            ji(),
            Vi(10, 'td'),
            Ii(11, Qm, 3, 2, 'div', 8),
            ji(),
            Vi(12, 'td'),
            Vi(13, 'input', 12),
            Hi('click', function () {
              Be(t)
              const n = e.$implicit
              return qi().join(n)
            }),
            ji(),
            ji(),
            Vi(14, 'td'),
            Ii(15, Jm, 2, 0, 'div', 8),
            ji(),
            ji()
        }
        if (2 & t) {
          const t = e.$implicit,
            n = qi()
          Tr(2),
            so(Ea(3, 6, t.created, 'dd/MM/yyyy')),
            Tr(3),
            so(t.game),
            Tr(2),
            so(t.player_name),
            Tr(2),
            so(t.last_turn),
            Tr(2),
            Ni('ngIf', n.isStyled(t.game_id)),
            Tr(4),
            Ni('ngIf', n.isRoot())
        }
      }
      let Ym = (() => {
          class t {
            constructor (t, e, n) {
              ;(this.serv = t),
                (this.router = e),
                (this.activateRoute = n),
                (this.tourn = null),
                (this.sessions = new Array()),
                (this.styles = new Array()),
                (this.id = n.snapshot.params.id),
                (this.user = n.snapshot.params.us)
            }
            ngOnInit () {
              this.loadTourn()
            }
            back () {
              let t = 'tournament'
              this.tourn &&
                ((t = t + '/' + this.tourn.game_id),
                this.tourn.variant_id
                  ? (t = t + '/' + this.tourn.variant_id)
                  : (t += '/0')),
                this.router.navigate([t])
            }
            loadTourn () {
              this.serv.getTourn(this.id).subscribe(
                t => {
                  ;(this.tourn = t), this.loadStyles()
                },
                t => {
                  let e = t.status
                  ;[401, 403].includes(e)
                    ? this.router.navigate([''])
                    : alert('Error: ' + e)
                }
              )
            }
            loadStyles () {
              this.serv.getStyles().subscribe(
                t => {
                  ;(this.styles = t), this.loadSessions()
                },
                t => {
                  let e = t.status
                  ;[401, 403].includes(e)
                    ? this.router.navigate([''])
                    : alert('Error: ' + e)
                }
              )
            }
            getStyles (t) {
              return this.styles.filter(e => e.game_id == t)
            }
            isStyled (t) {
              return this.getStyles(t).length > 0
            }
            changeFilter () {
              this.loadSessions()
            }
            changeStyle (t) {
              const e = this.styles.filter(e => e.id == t.style)
              e.length > 0 && localStorage.setItem('myCurrStyle', e[0].suffix)
            }
            initStyle (t) {
              const e = this.getStyles(t.game_id),
                n = localStorage.getItem('myCurrStyle')
              if (n) {
                const r = e.filter(t => t.suffix == n)
                if (r.length > 0) return void (t.style = r[0].id)
              }
              e.length > 0 && (t.style = e[0].id)
            }
            loadSessions () {
              let t = '' + this.tourn.id
              this.user && (t = t + '/' + this.user),
                this.serv.getSessions(t).subscribe(
                  t => {
                    t.forEach(t => {
                      this.initStyle(t)
                    }),
                      (this.sessions = t)
                  },
                  t => {
                    let e = t.status
                    ;[401, 403].includes(e)
                      ? this.router.navigate([''])
                      : alert('Error: ' + e)
                  }
                )
            }
            join (t) {
              this.launch(t, t.filename)
            }
            launch (t, e) {
              let n = '/yahia/' + e
              const r = this.styles.filter(e => t.style == e.id)
              r.length && (n += r[0].suffix),
                t.ai && (n += '-ai'),
                (n = n + '.html?sid=' + t.id),
                t.selector_value > 0 &&
                  (n = n + '&selector=' + t.selector_value),
                n && (window.location.href = n)
            }
            delete (t) {
              confirm('Delele Session?') &&
                this.serv.delSessions(t.id).subscribe(
                  t => {
                    this.loadSessions()
                  },
                  t => {
                    let e = t.status
                    ;[401, 403].includes(e)
                      ? this.router.navigate([''])
                      : alert('Error: ' + e)
                  }
                )
            }
            isRoot () {
              return '1' == localStorage.getItem('myRole')
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Pi(Bm), Pi(Wp), Pi(Ud))
            }),
            (t.ɵcmp = ce({
              type: t,
              selectors: [['app-games']],
              features: [Eo([Bm])],
              decls: 39,
              vars: 2,
              consts: [
                [1, 'table'],
                [2, 'width', '10%'],
                ['href', '/map'],
                ['href', '/launch'],
                ['href', '/session'],
                ['href', '/profile'],
                [2, 'width', '60%'],
                ['href', '/'],
                [4, 'ngIf'],
                [1, 'table', 'table-striped'],
                [4, 'ngFor', 'ngForOf'],
                [3, 'click'],
                [
                  'type',
                  'button',
                  'value',
                  'Join',
                  1,
                  'btn',
                  'btn-success',
                  3,
                  'click'
                ],
                [
                  'name',
                  'it.style',
                  1,
                  'form-control',
                  3,
                  'ngModel',
                  'ngModelChange',
                  'change'
                ],
                [3, 'value', 4, 'ngFor', 'ngForOf'],
                [3, 'value'],
                [
                  'type',
                  'button',
                  'value',
                  'Delete',
                  1,
                  'btn',
                  'btn-danger',
                  3,
                  'click'
                ]
              ],
              template: function (t, e) {
                1 & t &&
                  (Vi(0, 'table', 0),
                  Vi(1, 'thead'),
                  Vi(2, 'tr'),
                  Vi(3, 'th', 1),
                  Vi(4, 'a', 2),
                  ro(5, 'Games'),
                  ji(),
                  ji(),
                  Vi(6, 'th', 1),
                  Vi(7, 'a', 3),
                  ro(8, 'Launch'),
                  ji(),
                  ji(),
                  Vi(9, 'th', 1),
                  Vi(10, 'a', 4),
                  ro(11, 'Sessions'),
                  ji(),
                  ji(),
                  Vi(12, 'th', 1),
                  Vi(13, 'b'),
                  ro(14, 'Tournaments'),
                  ji(),
                  ji(),
                  Vi(15, 'th', 1),
                  Vi(16, 'a', 5),
                  ro(17, 'Profile'),
                  ji(),
                  ji(),
                  Vi(18, 'th', 6),
                  Vi(19, 'a', 7),
                  ro(20, 'Log Out'),
                  ji(),
                  ji(),
                  ji(),
                  ji(),
                  ji(),
                  Ii(21, Wm, 3, 1, 'h3', 8),
                  Vi(22, 'table', 9),
                  Vi(23, 'thead'),
                  Vi(24, 'tr'),
                  Vi(25, 'td'),
                  ro(26, 'Date'),
                  ji(),
                  Vi(27, 'td'),
                  ro(28, 'Game'),
                  ji(),
                  Vi(29, 'td'),
                  ro(30, 'Player'),
                  ji(),
                  Vi(31, 'td'),
                  ro(32, 'Turns'),
                  ji(),
                  Vi(33, 'td'),
                  ro(34, 'Style'),
                  ji(),
                  Fi(35, 'td'),
                  Fi(36, 'td'),
                  ji(),
                  ji(),
                  Vi(37, 'tbody'),
                  Ii(38, Km, 16, 9, 'tr', 10),
                  ji(),
                  ji()),
                  2 & t &&
                    (Tr(21),
                    Ni('ngIf', e.tourn),
                    Tr(17),
                    Ni('ngForOf', e.sessions))
              },
              directives: [Qu, Wu, Rg, lg, gm, Ng, Fg],
              pipes: [tc],
              styles: ['']
            })),
            t
          )
        })(),
        Xm = (() => {
          class t {
            canActivate (t, e) {
              const n = t.routeConfig.path
              if (/^launch\//.test(n)) {
                const e = t.params,
                  r = n.replace(':g', e.g).replace(':v', e.v)
                localStorage.setItem('currGame', r)
              }
              return !!localStorage.getItem('myAuthToken')
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)()
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })()
      class ty {
        constructor (t, e, n, r) {
          ;(this.game_id = t),
            (this.variant_id = e),
            (this.selector_value = n),
            (this.name = r)
        }
      }
      let ey = (() => {
        class t {
          constructor (t) {
            ;(this.http = t),
              (this.game = '/api/game'),
              (this.sess = '/api/session'),
              (this.tourn = '/api/tournament')
          }
          getTime () {
            return this.http.get(this.tourn + '/time')
          }
          getGames () {
            return this.http.get(this.game)
          }
          getVariants (t) {
            return this.http.get(this.game + '/' + t + '/variants')
          }
          getSetups (t, e) {
            return this.http.get(
              e
                ? this.game + '/setups/' + t + '/' + e
                : this.game + '/setups/' + t
            )
          }
          getStyles (t) {
            return this.http.get(this.game + '/' + t + '/styles')
          }
          getPreview (t, e, n) {
            return this.http.post(this.game + '/preview', {
              filename: t,
              selector_value: e,
              style: n
            })
          }
          createSession (t, e, n, r, s, i, o) {
            return this.http.post(
              this.sess,
              i || !o
                ? {
                    game_id: t,
                    filename: e,
                    selector_value: n,
                    player_num: r,
                    variant_id: s,
                    with_ai: i
                  }
                : {
                    game_id: t,
                    filename: e,
                    selector_value: n,
                    player_num: r,
                    variant_id: s,
                    with_ai: i,
                    timecontrol_id: o
                  }
            )
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Wt(Pf))
          }),
          (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
          t
        )
      })()
      function ny (t, e) {
        if (
          (1 & t && (Vi(0, 'div'), Vi(1, 'a', 27), ro(2, 'Rules'), ji(), ji()),
          2 & t)
        ) {
          const t = qi(2)
          Tr(1), Ni('href', t.preview.rules, hr)
        }
      }
      function ry (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'div', 24),
            Ii(1, ny, 3, 1, 'div', 25),
            Vi(2, 'img', 26),
            Hi('click', function () {
              return Be(t), qi().submit()
            }),
            ji(),
            ji()
        }
        if (2 & t) {
          const t = qi()
          Tr(1),
            Ni('ngIf', t.preview.rules),
            Tr(1),
            Wi('src', 'api/upload/', t.preview.preview, '.png', hr)
        }
      }
      function sy (t, e) {
        if ((1 & t && (Vi(0, 'option', 28), ro(1), ji()), 2 & t)) {
          const t = e.$implicit
          Ni('value', t.id), Tr(1), io(' ', t.name, ' ')
        }
      }
      function iy (t, e) {
        if ((1 & t && (Vi(0, 'option', 28), ro(1), ji()), 2 & t)) {
          const t = e.$implicit
          Ni('value', t.id), Tr(1), io(' ', t.name, ' ')
        }
      }
      function oy (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'div', 17),
            Vi(1, 'label'),
            ro(2, 'Variant'),
            ji(),
            Vi(3, 'select', 29),
            Hi('ngModelChange', function (e) {
              return Be(t), (qi().curr_var = e)
            })('change', function () {
              return Be(t), qi().varChanged()
            }),
            Ii(4, iy, 2, 2, 'option', 19),
            ji(),
            ji()
        }
        if (2 & t) {
          const t = qi()
          Tr(3), Ni('ngModel', t.curr_var), Tr(1), Ni('ngForOf', t.variants)
        }
      }
      function ay (t, e) {
        if ((1 & t && (Vi(0, 'option', 28), ro(1), ji()), 2 & t)) {
          const t = e.$implicit
          Ni('value', t.id), Tr(1), io(' ', t.name, ' ')
        }
      }
      function ly (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'div', 17),
            Vi(1, 'label'),
            ro(2, 'Styles'),
            ji(),
            Vi(3, 'select', 30),
            Hi('ngModelChange', function (e) {
              return Be(t), (qi().curr_style = e)
            })('change', function () {
              return Be(t), qi().changeStyle()
            }),
            Ii(4, ay, 2, 2, 'option', 19),
            ji(),
            ji()
        }
        if (2 & t) {
          const t = qi()
          Tr(3), Ni('ngModel', t.curr_style), Tr(1), Ni('ngForOf', t.styles)
        }
      }
      function uy (t, e) {
        if ((1 & t && (Vi(0, 'option', 28), ro(1), ji()), 2 & t)) {
          const t = e.$implicit
          Ni('value', t.selector_value), Tr(1), io(' ', t.name, ' ')
        }
      }
      function cy (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'div', 17),
            Vi(1, 'label'),
            ro(2, 'Arrangement'),
            ji(),
            Vi(3, 'select', 31),
            Hi('ngModelChange', function (e) {
              return Be(t), (qi().selector = e)
            })('change', function () {
              return Be(t), qi().loadPreview()
            }),
            Ii(4, uy, 2, 2, 'option', 19),
            ji(),
            ji()
        }
        if (2 & t) {
          const t = qi()
          Tr(3), Ni('ngModel', t.selector), Tr(1), Ni('ngForOf', t.setups)
        }
      }
      function hy (t, e) {
        if ((1 & t && (Vi(0, 'option', 28), ro(1), ji()), 2 & t)) {
          const t = e.$implicit
          Ni('value', t), Tr(1), io(' Player ', t, ' ')
        }
      }
      function dy (t, e) {
        if ((1 & t && (Vi(0, 'option', 28), ro(1), ji()), 2 & t)) {
          const t = e.$implicit
          Ni('value', t.id), Tr(1), io(' ', t.name, ' ')
        }
      }
      function py (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'div', 17),
            Vi(1, 'label'),
            ro(2, 'Time Control'),
            ji(),
            Vi(3, 'select', 32),
            Hi('ngModelChange', function (e) {
              return Be(t), (qi().timecontrol_id = e)
            }),
            Ii(4, dy, 2, 2, 'option', 19),
            ji(),
            ji()
        }
        if (2 & t) {
          const t = qi()
          Tr(3),
            Ni('ngModel', t.timecontrol_id),
            Tr(1),
            Ni('ngForOf', t.timecontrol)
        }
      }
      function fy (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'div', 17),
            Vi(1, 'input', 33),
            Hi('ngModelChange', function (e) {
              return Be(t), (qi().ai_selected = e)
            }),
            ji(),
            Vi(2, 'label', 34),
            ro(3, '\xa0Play against AI'),
            ji(),
            ji()
        }
        if (2 & t) {
          const t = qi()
          Tr(1), Ni('ngModel', t.ai_selected)
        }
      }
      function gy (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'button', 22),
            Hi('click', function () {
              return Be(t), qi().view(1)
            }),
            ro(1, 'Join'),
            ji()
        }
      }
      function my (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'button', 22),
            Hi('click', function () {
              return Be(t), qi().view(6)
            }),
            ro(1, 'View'),
            ji()
        }
      }
      function yy (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'button', 22),
            Hi('click', function () {
              return Be(t), qi().tourn()
            }),
            ro(1, 'Tournaments'),
            ji()
        }
      }
      let vy = (() => {
          class t {
            constructor (t, e, n) {
              ;(this.serv = t),
                (this.router = e),
                (this.activateRoute = n),
                (this.timecontrol = new Array()),
                (this.timecontrol_id = 0),
                (this.games = new Array()),
                (this.curr_game = null),
                (this.variants = new Array()),
                (this.curr_var = null),
                (this.styles = new Array()),
                (this.curr_style = null),
                (this.player_num = 1),
                (this.players_total = 0),
                (this.setups = new Array()),
                (this.selector = 0),
                (this.max_selector = 0),
                (this.preview = null),
                (this.ai_selected = !1),
                (this.start_game = n.snapshot.params.g),
                (this.start_var = n.snapshot.params.v),
                (this.start_setup = n.snapshot.params.s)
            }
            ngOnInit () {
              this.loadGames()
            }
            checkBot (t) {
              return !(
                (!t.startsWith('0:') && !t.startsWith(this.selector + ':')) ||
                (!t.endsWith(':0') && !t.endsWith(':' + this.player_num))
              )
            }
            checkBots (t) {
              var e = !1
              return (
                t.split(',').forEach(t => {
                  this.checkBot(t) && (e = !0)
                }),
                e || (this.ai_selected = !1),
                e
              )
            }
            isAi () {
              const t = this.games.filter(t => t.id == this.curr_game)
              if (t.length > 0) {
                if (
                  t[0].no_ai &&
                  (',' + t[0].no_ai + ',').indexOf(',' + this.selector + ',') >=
                    0
                )
                  return (this.ai_selected = !1), !1
                if (t[0].external_ai) return !0
                if (t[0].bots) return this.checkBots(t[0].bots)
              }
              const e = this.variants.filter(t => t.id == this.curr_var)
              if (e.length > 0) {
                if (
                  e[0].no_ai &&
                  (',' + e[0].no_ai + ',').indexOf(',' + this.selector + ',') >=
                    0
                )
                  return (this.ai_selected = !1), !1
                if (e[0].external_ai) return !0
                if (e[0].bots) return this.checkBots(e[0].bots)
              }
              return !1
            }
            getPlayers () {
              let t = new Array()
              for (let e = 1; e <= this.players_total; e++) t.push(e)
              return t
            }
            loadTimeControls () {
              this.serv.getTime().subscribe(
                t => {
                  this.timecontrol = t
                },
                t => {
                  let e = t.status
                  ;[401, 403].includes(e)
                    ? this.router.navigate([''])
                    : alert('Error: ' + e)
                }
              )
            }
            loadSetups () {
              this.serv.getSetups(this.curr_game, this.curr_var).subscribe(
                t => {
                  if (((this.setups = t), 0 == this.setups.length))
                    for (let e = 1; e <= this.max_selector; e++)
                      this.setups.push(
                        new ty(this.curr_game, this.curr_var, e, e.toString())
                      )
                  this.setups.length > 0 &&
                    (this.selector = t[0].selector_value)
                },
                t => {
                  let e = t.status
                  ;[401, 403].includes(e)
                    ? this.router.navigate([''])
                    : alert('Error: ' + e)
                }
              )
            }
            loadGames () {
              this.serv.getGames().subscribe(
                t => {
                  if (((this.games = t), t.length > 0)) {
                    let e = t[0]
                    if (this.start_game) {
                      const t = this.games.filter(t => t.id == this.start_game)
                      t && t.length > 0 && (e = t[0])
                    }
                    ;(this.curr_game = e.id),
                      (this.players_total = e.players_total),
                      (this.max_selector = e.max_selector),
                      this.max_selector > 1
                        ? ((this.selector = 1),
                          this.start_setup &&
                            (this.start_setup <= this.max_selector &&
                              (this.selector = this.start_setup),
                            (this.start_setup = null)))
                        : (this.selector = 0),
                      this.loadVars(),
                      this.loadStyles(),
                      this.loadSetups(),
                      this.loadTimeControls()
                  }
                },
                t => {
                  let e = t.status
                  ;[401, 403].includes(e)
                    ? this.router.navigate([''])
                    : alert('Error: ' + e)
                }
              )
            }
            gameChanged () {
              this.player_num = 1
              const t = this.games.filter(t => t.id == this.curr_game)
              1 == t.length &&
                ((this.players_total = t[0].players_total),
                (this.max_selector = t[0].max_selector),
                (this.selector = this.max_selector > 1 ? 1 : 0),
                (this.ai_selected = !1)),
                (this.curr_var = null),
                this.loadVars(),
                this.loadStyles(),
                this.loadSetups()
            }
            initStyle () {
              const t = localStorage.getItem('myCurrStyle')
              if (t) {
                const e = this.styles.filter(e => e.suffix == t)
                if (e.length > 0) return void (this.curr_style = e[0].id)
              }
              this.styles.length > 0 && (this.curr_style = this.styles[0].id)
            }
            changeStyle () {
              const t = this.styles.filter(t => t.id == this.curr_style)
              t.length > 0 && localStorage.setItem('myCurrStyle', t[0].suffix),
                this.loadPreview()
            }
            loadStyles () {
              ;(this.curr_style = null),
                this.serv.getStyles(this.curr_game).subscribe(
                  t => {
                    ;(this.styles = t), this.initStyle(), this.loadPreview()
                  },
                  t => {
                    let e = t.status
                    ;[401, 403].includes(e)
                      ? this.router.navigate([''])
                      : alert('Error: ' + e)
                  }
                )
            }
            loadVars () {
              this.serv.getVariants(this.curr_game).subscribe(
                t => {
                  if (((this.variants = t), t.length > 0)) {
                    const t = this.games.filter(t => t.id == this.curr_game)
                    if (1 == t.length) {
                      let e = this.variants.filter(
                        e => e.filename == t[0].filename
                      )
                      if (this.start_var) {
                        const t = this.variants.filter(
                          t => t.id == this.start_var
                        )
                        t && t.length > 0 && ((e = t), (this.start_var = null))
                      }
                      e.length > 0 &&
                        ((this.curr_var = e[0].id),
                        (this.players_total = e[0].players_total),
                        (this.max_selector = e[0].max_selector),
                        this.max_selector > 1
                          ? ((this.selector = 1),
                            this.start_setup &&
                              (this.start_setup <= this.max_selector &&
                                (this.selector = this.start_setup),
                              (this.start_setup = null)))
                          : (this.selector = 0))
                    }
                  }
                  this.loadPreview(), this.loadSetups()
                },
                t => {
                  let e = t.status
                  ;[401, 403].includes(e)
                    ? this.router.navigate([''])
                    : alert('Error: ' + e)
                }
              )
            }
            varChanged () {
              this.player_num = 1
              const t = this.variants.filter(t => t.id == this.curr_var)
              1 == t.length &&
                ((this.players_total = t[0].players_total),
                (this.max_selector = t[0].max_selector),
                (this.selector = this.max_selector > 1 ? 1 : 0),
                (this.ai_selected = !1),
                this.loadPreview(),
                this.loadSetups())
            }
            getGame () {
              if (this.curr_var) {
                const t = this.variants.filter(t => t.id == this.curr_var)
                if (1 == t.length) return t[0]
              }
              if (this.curr_game) {
                const t = this.games.filter(t => t.id == this.curr_game)
                if (1 == t.length) return t[0]
              }
              return null
            }
            submit () {
              if (!confirm('Launch the game?')) return
              const t = this.getGame()
              t &&
                this.serv
                  .createSession(
                    this.curr_game,
                    t.filename,
                    this.selector,
                    this.player_num,
                    this.curr_var,
                    this.ai_selected,
                    this.timecontrol_id
                  )
                  .subscribe(
                    t => {
                      const e = t.id
                      let n = '/yahia/' + t.filename
                      const r = this.styles.filter(t => t.id == this.curr_style)
                      1 == r.length && (n += r[0].suffix),
                        t.with_ai && (n += '-ai'),
                        (n = n + '.html?sid=' + e),
                        this.selector > 0 &&
                          (n = n + '&selector=' + this.selector),
                        this.start_game
                          ? (this.curr_game = this.start_game)
                          : this.games.length > 0 &&
                            (this.curr_game = this.games[0].id),
                        n && (window.location.href = n)
                    },
                    t => {
                      let e = t.status
                      404 != e &&
                        ([401, 403].includes(e)
                          ? this.router.navigate([''])
                          : alert('Error: ' + e))
                    }
                  )
            }
            loadPreview () {
              this.preview = null
              const t = this.getGame()
              t &&
                this.serv
                  .getPreview(t.filename, this.selector, this.curr_style)
                  .subscribe(
                    t => {
                      this.preview = t
                    },
                    t => {
                      let e = t.status
                      404 != e &&
                        ([401, 403].includes(e)
                          ? this.router.navigate([''])
                          : alert('Error: ' + e))
                    }
                  )
            }
            viewPresent (t) {
              if (!this.curr_game) return !1
              let e = this.games.filter(t => t.id == this.curr_game)
              return (
                this.curr_var &&
                  (e = this.variants.filter(t => t.id == this.curr_var)),
                0 != e.length &&
                  (1 == t
                    ? !!e[0].waiting && e[0].waiting > 0
                    : !!e[0].all && e[0].all > 0)
              )
            }
            view (t) {
              if (!this.curr_game) return
              let e = 'session/' + t + '/' + this.curr_game
              this.curr_var && (e = e + '/' + this.curr_var),
                this.router.navigate([e])
            }
            isTourn () {
              let t = this.games.filter(t => t.id == this.curr_game)
              return (
                this.curr_var &&
                  (t = this.variants.filter(t => t.id == this.curr_var)),
                0 != t.length && t[0].is_tournament
              )
            }
            tourn () {
              let t = 'tournament'
              this.curr_game && (t = t + '/' + this.curr_game),
                this.curr_var ? (t = t + '/' + this.curr_var) : (t += '/0'),
                this.variants.filter(t => t.id == this.curr_var),
                this.router.navigate([t])
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Pi(ey), Pi(Wp), Pi(Ud))
            }),
            (t.ɵcmp = ce({
              type: t,
              selectors: [['launch']],
              features: [Eo([ey])],
              decls: 61,
              vars: 13,
              consts: [
                [1, 'table'],
                [2, 'width', '10%'],
                ['href', '/map'],
                ['href', '/session'],
                ['href', '/tournament'],
                ['href', '/payments'],
                ['href', '/profile'],
                [2, 'width', '60%'],
                ['href', '/'],
                [1, 'table', 'table-striped'],
                [1, 'col-sm-3', 'd-flex', 'align-items-stretch'],
                [
                  'class',
                  'image',
                  'style',
                  'margin:20px;background-size:contain;min-height:160px;',
                  4,
                  'ngIf'
                ],
                [1, 'jumbotron'],
                [1, 'container'],
                [1, 'row'],
                [1, 'col-md-6', 'offset-md-3'],
                [1, 'launch-form'],
                [1, 'form-group'],
                [
                  'name',
                  'curr_game',
                  1,
                  'form-control',
                  3,
                  'ngModel',
                  'ngModelChange',
                  'change'
                ],
                [3, 'value', 4, 'ngFor', 'ngForOf'],
                ['class', 'form-group', 4, 'ngIf'],
                [
                  'name',
                  'player_num',
                  1,
                  'form-control',
                  3,
                  'ngModel',
                  'ngModelChange'
                ],
                [1, 'btn', 'btn-primary', 3, 'click'],
                ['class', 'btn btn-primary', 3, 'click', 4, 'ngIf'],
                [
                  1,
                  'image',
                  2,
                  'margin',
                  '20px',
                  'background-size',
                  'contain',
                  'min-height',
                  '160px'
                ],
                [4, 'ngIf'],
                [3, 'src', 'click'],
                ['target', '_blank', 3, 'href'],
                [3, 'value'],
                [
                  'name',
                  'curr_var',
                  1,
                  'form-control',
                  3,
                  'ngModel',
                  'ngModelChange',
                  'change'
                ],
                [
                  'name',
                  'curr_style',
                  1,
                  'form-control',
                  3,
                  'ngModel',
                  'ngModelChange',
                  'change'
                ],
                [
                  'name',
                  'selector',
                  1,
                  'form-control',
                  3,
                  'ngModel',
                  'ngModelChange',
                  'change'
                ],
                [
                  'name',
                  'timecontrol_id',
                  1,
                  'form-control',
                  3,
                  'ngModel',
                  'ngModelChange'
                ],
                [
                  'id',
                  'ai',
                  'name',
                  'ai',
                  'type',
                  'checkbox',
                  3,
                  'ngModel',
                  'ngModelChange'
                ],
                ['for', 'ai']
              ],
              template: function (t, e) {
                1 & t &&
                  (Vi(0, 'table', 0),
                  Vi(1, 'thead'),
                  Vi(2, 'tr'),
                  Vi(3, 'th', 1),
                  Vi(4, 'a', 2),
                  ro(5, 'Games'),
                  ji(),
                  ji(),
                  Vi(6, 'th', 1),
                  Vi(7, 'b'),
                  ro(8, 'Launch'),
                  ji(),
                  ji(),
                  Vi(9, 'th', 1),
                  Vi(10, 'a', 3),
                  ro(11, 'Sessions'),
                  ji(),
                  ji(),
                  Vi(12, 'th', 1),
                  Vi(13, 'a', 4),
                  ro(14, 'Tournaments'),
                  ji(),
                  ji(),
                  Vi(15, 'th', 1),
                  Vi(16, 'a', 5),
                  ro(17, 'Payments'),
                  ji(),
                  ji(),
                  Vi(18, 'th', 1),
                  Vi(19, 'a', 6),
                  ro(20, 'Profile'),
                  ji(),
                  ji(),
                  Vi(21, 'th', 7),
                  Vi(22, 'a', 8),
                  ro(23, 'Log Out'),
                  ji(),
                  ji(),
                  ji(),
                  ji(),
                  ji(),
                  Vi(24, 'h3'),
                  ro(25, ' العب'),
                  ji(),
                  Vi(26, 'table', 9),
                  Vi(27, 'tr'),
                  Vi(28, 'td'),
                  Vi(29, 'div', 10),
                  Ii(30, ry, 3, 2, 'div', 11),
                  ji(),
                  ji(),
                  Vi(31, 'td'),
                  Vi(32, 'div', 12),
                  Vi(33, 'div', 13),
                  Vi(34, 'div', 14),
                  Vi(35, 'div', 15),
                  Vi(36, 'div', 16),
                  Vi(37, 'div', 17),
                  Vi(38, 'label'),
                  ro(39, 'Game'),
                  ji(),
                  Vi(40, 'select', 18),
                  Hi('ngModelChange', function (t) {
                    return (e.curr_game = t)
                  })('change', function () {
                    return e.gameChanged()
                  }),
                  Ii(41, sy, 2, 2, 'option', 19),
                  ji(),
                  ji(),
                  Ii(42, oy, 5, 2, 'div', 20),
                  Ii(43, ly, 5, 2, 'div', 20),
                  Ii(44, cy, 5, 2, 'div', 20),
                  Vi(45, 'div', 17),
                  Vi(46, 'label'),
                  ro(47, 'Player'),
                  ji(),
                  Vi(48, 'select', 21),
                  Hi('ngModelChange', function (t) {
                    return (e.player_num = t)
                  }),
                  Ii(49, hy, 2, 2, 'option', 19),
                  ji(),
                  ji(),
                  Ii(50, py, 5, 2, 'div', 20),
                  Ii(51, fy, 4, 1, 'div', 20),
                  Vi(52, 'div', 17),
                  Vi(53, 'button', 22),
                  Hi('click', function () {
                    return e.submit()
                  }),
                  ro(54, 'Launch'),
                  ji(),
                  ro(55, ' \xa0 '),
                  Ii(56, gy, 2, 0, 'button', 23),
                  ro(57, ' \xa0 '),
                  Ii(58, my, 2, 0, 'button', 23),
                  ro(59, ' \xa0 '),
                  Ii(60, yy, 2, 0, 'button', 23),
                  ji(),
                  ji(),
                  ji(),
                  ji(),
                  ji(),
                  ji(),
                  ji(),
                  ji(),
                  ji()),
                  2 & t &&
                    (Tr(30),
                    Ni('ngIf', e.preview),
                    Tr(10),
                    Ni('ngModel', e.curr_game),
                    Tr(1),
                    Ni('ngForOf', e.games),
                    Tr(1),
                    Ni('ngIf', e.variants.length),
                    Tr(1),
                    Ni('ngIf', e.styles.length),
                    Tr(1),
                    Ni('ngIf', e.max_selector),
                    Tr(4),
                    Ni('ngModel', e.player_num),
                    Tr(1),
                    Ni('ngForOf', e.getPlayers()),
                    Tr(1),
                    Ni('ngIf', !e.ai_selected),
                    Tr(1),
                    Ni('ngIf', e.isAi()),
                    Tr(5),
                    Ni('ngIf', e.viewPresent(1)),
                    Tr(2),
                    Ni('ngIf', e.viewPresent(6)),
                    Tr(2),
                    Ni('ngIf', e.isTourn()))
              },
              directives: [Qu, Rg, lg, gm, Wu, Ng, Fg, Yf],
              styles: ['']
            })),
            t
          )
        })(),
        _y = (() => {
          class t {
            constructor (t) {
              ;(this.http = t), (this.url = '/api/game/map')
            }
            getGames () {
              return this.http.get(this.url)
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Wt(Pf))
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })()
      function wy (t, e) {
        if ((1 & t && (Vi(0, 'a', 6), Fi(1, 'img', 7), ji()), 2 & t)) {
          const t = qi().$implicit
          Zi('href', 'launch/', t.id, '/', t.variant_id, '', hr),
            Tr(1),
            Wi('src', 'api/upload/', t.preview, '.png', hr)
        }
      }
      function by (t, e) {
        if ((1 & t && (Vi(0, 'a', 6), Fi(1, 'img', 7), ji()), 2 & t)) {
          const t = qi().$implicit
          Wi('href', 'launch/', t.id, '', hr),
            Tr(1),
            Wi('src', 'api/upload/', t.preview, '.png', hr)
        }
      }
      function Cy (t, e) {
        if ((1 & t && (Vi(0, 'a', 8), Vi(1, 'b'), ro(2), ji(), ji()), 2 & t)) {
          const t = qi().$implicit
          Bi('href', t.rules, hr), Tr(2), so(t.name)
        }
      }
      function Sy (t, e) {
        if ((1 & t && (Vi(0, 'b'), ro(1), ji()), 2 & t)) {
          const t = qi().$implicit
          Tr(1), so(t.name)
        }
      }
      function xy (t, e) {
        if (
          (1 & t &&
            (Vi(0, 'div', 2),
            Ii(1, wy, 2, 3, 'a', 3),
            Ii(2, by, 2, 2, 'a', 3),
            Vi(3, 'p'),
            Ii(4, Cy, 3, 2, 'a', 4),
            Ii(5, Sy, 2, 1, 'b', 5),
            ji(),
            ji()),
          2 & t)
        ) {
          const t = e.$implicit
          Tr(1),
            Ni('ngIf', t.variant_id),
            Tr(1),
            Ni('ngIf', !t.variant_id),
            Tr(2),
            Ni('ngIf', t.rules),
            Tr(1),
            Ni('ngIf', !t.rules)
        }
      }
      let Ey = (() => {
          class t {
            constructor (t) {
              ;(this.serv = t), (this.games = new Array())
            }
            ngOnInit () {
              localStorage.getItem('myAuthToken') ||
                localStorage.setItem('myAuthToken', '...'),
                this.loadGames()
            }
            loadGames () {
              this.serv.getGames().subscribe(
                t => {
                  this.games = t
                },
                t => {
                  alert('Error: ' + t.status)
                }
              )
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Pi(_y))
            }),
            (t.ɵcmp = ce({
              type: t,
              selectors: [['app-map']],
              features: [Eo([_y])],
              decls: 2,
              vars: 1,
              consts: [
                [1, 'divGameIconWrap'],
                ['class', 'divGameIcon', 4, 'ngFor', 'ngForOf'],
                [1, 'divGameIcon'],
                [3, 'href', 4, 'ngIf'],
                ['target', '_blank', 3, 'href', 4, 'ngIf'],
                [4, 'ngIf'],
                [3, 'href'],
                [3, 'src'],
                ['target', '_blank', 3, 'href']
              ],
              template: function (t, e) {
                1 & t && (Vi(0, 'div', 0), Ii(1, xy, 6, 4, 'div', 1), ji()),
                  2 & t && (Tr(1), Ni('ngForOf', e.games))
              },
              directives: [Wu, Qu],
              styles: [
                '.divGameIconWrap[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap}.divGameIcon[_ngcontent-%COMP%]{text-align:center;margin:7px;flex-basis:200px;height:210px;flex-grow:2;max-width:260px;min-width:130px;flex-shrink:2}.divGameIcon[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{display:block}.divGameIcon[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{max-width:100%}@media (max-width:640px){.divGameIcon[_ngcontent-%COMP%]{flex-basis:160px}}'
              ]
            })),
            t
          )
        })(),
        Ty = (() => {
          class t {
            constructor (t) {
              ;(this.http = t), (this.tourn = '/api/tournament')
            }
            getTourn (t) {
              return this.http.get(this.tourn + '/id/' + t)
            }
            getMembers (t) {
              return this.http.get(this.tourn + '/members/' + t)
            }
            delMember (t) {
              return this.http.delete(this.tourn + '/members/' + t)
            }
            joinToTourn (t) {
              return this.http.post(this.tourn + '/join', { id: t })
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Wt(Pf))
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })()
      function ky (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'h3'),
            Vi(1, 'a', 11),
            Hi('click', function () {
              return Be(t), qi().back()
            }),
            ro(2),
            ji(),
            ji()
        }
        if (2 & t) {
          const t = qi()
          Tr(2), so(t.tourn.title)
        }
      }
      function Ay (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'div'),
            Vi(1, 'input', 14),
            Hi('click', function () {
              Be(t)
              const e = qi().$implicit
              return qi().delete(e)
            }),
            ji(),
            ji()
        }
      }
      const Oy = function (t, e) {
        return { up: t, down: e }
      }
      function Iy (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'tr'),
            Vi(1, 'td'),
            ro(2),
            ji(),
            Vi(3, 'td'),
            ro(4),
            ji(),
            Vi(5, 'td', 12),
            Vi(6, 'b'),
            ro(7),
            xa(8, 'number'),
            ji(),
            ji(),
            Vi(9, 'td'),
            ro(10),
            ji(),
            Vi(11, 'td'),
            ro(12),
            ji(),
            Vi(13, 'td'),
            ro(14),
            ji(),
            Vi(15, 'td'),
            Vi(16, 'input', 13),
            Hi('click', function () {
              Be(t)
              const n = e.$implicit
              return qi().games(n)
            }),
            ji(),
            ji(),
            Vi(17, 'td'),
            Ii(18, Ay, 2, 0, 'div', 8),
            ji(),
            ji()
        }
        if (2 & t) {
          const t = e.$implicit,
            n = qi()
          Tr(2),
            so(t.user),
            Tr(2),
            oo('', t.score, ' (', t.berger, ')'),
            Tr(1),
            Ni('ngClass', ba(13, Oy, 1 == t.is_inc, 0 == t.is_inc)),
            Tr(2),
            so(
              (function (t, e, n, r, s) {
                const i = ze(),
                  o = De(i, 8)
                return ka(
                  i,
                  Ta(i, 8)
                    ? (function (t, e, n, r, s, i, o, a) {
                        const l = e + n
                        return (function (t, e, n, r, s) {
                          const i = Ti(t, e, n, r)
                          return Ei(t, e + 2, s) || i
                        })(t, l, s, i, o)
                          ? xi(t, l + 3, a ? r.call(a, s, i, o) : r(s, i, o))
                          : Ca(t, l + 3)
                      })(i, Ye(), 9, o.transform, n, '3.2-2', 'en-US', o)
                    : o.transform(n, '3.2-2', 'en-US')
                )
              })(0, 0, t.rating)
            ),
            Tr(3),
            so(t.win),
            Tr(2),
            so(t.lose),
            Tr(2),
            so(t.all),
            Tr(4),
            Ni('ngIf', n.isRoot() || n.itsMe(t) || n.itsOwner())
        }
      }
      let My = (() => {
        class t {
          constructor (t, e, n) {
            ;(this.serv = t),
              (this.router = e),
              (this.activateRoute = n),
              (this.tourn = null),
              (this.members = new Array()),
              (this.id = n.snapshot.params.id)
          }
          ngOnInit () {
            this.loadTourn()
          }
          games (t) {
            this.router.navigate(['games/' + this.tourn.id + '/' + t.user_id])
          }
          back () {
            let t = 'tournament'
            this.tourn &&
              ((t = t + '/' + this.tourn.game_id),
              this.tourn.variant_id
                ? (t = t + '/' + this.tourn.variant_id)
                : (t += '/0')),
              this.router.navigate([t])
          }
          join () {
            confirm('Join to Tournament?')
              ? this.serv.joinToTourn(this.tourn.id).subscribe(
                  t => {
                    this.loadMembers()
                  },
                  t => {
                    let e = t.status
                    ;[401, 403].includes(e)
                      ? this.router.navigate([''])
                      : alert('Error: ' + e)
                  }
                )
              : this.loadMembers()
          }
          loadTourn () {
            this.serv.getTourn(this.id).subscribe(
              t => {
                ;(this.tourn = t),
                  this.tourn.closed || this.tourn.is_joined
                    ? this.loadMembers()
                    : this.join()
              },
              t => {
                let e = t.status
                ;[401, 403].includes(e)
                  ? this.router.navigate([''])
                  : alert('Error: ' + e)
              }
            )
          }
          loadMembers () {
            this.serv.getMembers(this.id).subscribe(
              t => {
                this.members = t
              },
              t => {
                let e = t.status
                ;[401, 403].includes(e)
                  ? this.router.navigate([''])
                  : alert('Error: ' + e)
              }
            )
          }
          delete (t) {
            confirm('Delete Member?') &&
              (console.log(t),
              this.serv.delMember(t.id).subscribe(
                t => {
                  this.loadMembers()
                },
                t => {
                  let e = t.status
                  ;[401, 403].includes(e)
                    ? this.router.navigate([''])
                    : alert('Error: ' + e)
                }
              ))
          }
          itsOwner () {
            return (
              !!this.tourn &&
              +localStorage.getItem('myId') == this.tourn.user_id
            )
          }
          itsMe (t) {
            return +localStorage.getItem('myId') == t.user_id
          }
          isRoot () {
            return '1' == localStorage.getItem('myRole')
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Pi(Ty), Pi(Wp), Pi(Ud))
          }),
          (t.ɵcmp = ce({
            type: t,
            selectors: [['app-members']],
            features: [Eo([Ty])],
            decls: 41,
            vars: 2,
            consts: [
              [1, 'table'],
              [2, 'width', '10%'],
              ['href', '/map'],
              ['href', '/launch'],
              ['href', '/session'],
              ['href', '/profile'],
              [2, 'width', '60%'],
              ['href', '/'],
              [4, 'ngIf'],
              [1, 'table', 'table-striped'],
              [4, 'ngFor', 'ngForOf'],
              [3, 'click'],
              [3, 'ngClass'],
              [
                'type',
                'button',
                'value',
                'Games',
                1,
                'btn',
                'btn-success',
                3,
                'click'
              ],
              [
                'type',
                'button',
                'value',
                'Delete',
                1,
                'btn',
                'btn-danger',
                3,
                'click'
              ]
            ],
            template: function (t, e) {
              1 & t &&
                (Vi(0, 'table', 0),
                Vi(1, 'thead'),
                Vi(2, 'tr'),
                Vi(3, 'th', 1),
                Vi(4, 'a', 2),
                ro(5, 'Games'),
                ji(),
                ji(),
                Vi(6, 'th', 1),
                Vi(7, 'a', 3),
                ro(8, 'Launch'),
                ji(),
                ji(),
                Vi(9, 'th', 1),
                Vi(10, 'a', 4),
                ro(11, 'Sessions'),
                ji(),
                ji(),
                Vi(12, 'th', 1),
                Vi(13, 'b'),
                ro(14, 'Tournaments'),
                ji(),
                ji(),
                Vi(15, 'th', 1),
                Vi(16, 'a', 5),
                ro(17, 'Profile'),
                ji(),
                ji(),
                Vi(18, 'th', 6),
                Vi(19, 'a', 7),
                ro(20, 'Log Out'),
                ji(),
                ji(),
                ji(),
                ji(),
                ji(),
                Ii(21, ky, 3, 1, 'h3', 8),
                Vi(22, 'table', 9),
                Vi(23, 'thead'),
                Vi(24, 'tr'),
                Vi(25, 'td'),
                ro(26, 'Member'),
                ji(),
                Vi(27, 'td'),
                ro(28, 'Score'),
                ji(),
                Vi(29, 'td'),
                ro(30, 'Rating'),
                ji(),
                Vi(31, 'td'),
                ro(32, 'Win'),
                ji(),
                Vi(33, 'td'),
                ro(34, 'Lose'),
                ji(),
                Vi(35, 'td'),
                ro(36, 'Games'),
                ji(),
                Fi(37, 'td'),
                Fi(38, 'td'),
                ji(),
                ji(),
                Vi(39, 'tbody'),
                Ii(40, Iy, 19, 16, 'tr', 10),
                ji(),
                ji()),
                2 & t &&
                  (Tr(21),
                  Ni('ngIf', e.tourn),
                  Tr(19),
                  Ni('ngForOf', e.members))
            },
            directives: [Qu, Wu, qu],
            pipes: [ec],
            styles: [
              '.up[_ngcontent-%COMP%]{color:green}.down[_ngcontent-%COMP%]{color:red}'
            ]
          })),
          t
        )
      })()
      class Py {
        constructor (t, e, n, r, s) {
          ;(this.id = t),
            (this.account_id = e),
            (this.coupon = n),
            (this.amount = r),
            (this.created = s)
        }
      }
      let Ry = (() => {
        class t {
          constructor (t) {
            ;(this.http = t), (this.url = '/api')
          }
          getPayments () {
            return this.http.get(this.url + '/coupon/payments')
          }
          savePayment (t) {
            return this.http.post(this.url + '/account/coupon', t)
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Wt(Pf))
          }),
          (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
          t
        )
      })()
      const Ny = ['readOnlyTemplate'],
        Dy = ['editTemplate']
      function Vy (t, e) {}
      const jy = function (t) {
        return { $implicit: t }
      }
      function Fy (t, e) {
        if (
          (1 & t && (Vi(0, 'tr'), Ii(1, Vy, 0, 0, 'ng-template', 14), ji()),
          2 & t)
        ) {
          const t = e.$implicit,
            n = qi()
          Tr(1),
            Ni('ngTemplateOutlet', n.loadTemplate(t))(
              'ngTemplateOutletContext',
              wa(2, jy, t)
            )
        }
      }
      function Uy (t, e) {
        if (
          (1 & t &&
            (Vi(0, 'td'),
            ro(1),
            xa(2, 'date'),
            ji(),
            Vi(3, 'td'),
            ro(4),
            ji(),
            Vi(5, 'td'),
            ro(6),
            ji(),
            Fi(7, 'td'),
            Fi(8, 'td')),
          2 & t)
        ) {
          const t = e.$implicit
          Tr(1),
            so(Ea(2, 3, t.created, 'dd/MM/yyyy HH:mm')),
            Tr(3),
            so(t.coupon),
            Tr(2),
            so(t.amount)
        }
      }
      function Ly (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'td'),
            ro(1),
            xa(2, 'date'),
            ji(),
            Vi(3, 'td'),
            Vi(4, 'input', 15),
            Hi('ngModelChange', function (e) {
              return Be(t), (qi().edited.coupon = e)
            }),
            ji(),
            ji(),
            Fi(5, 'td'),
            Vi(6, 'td'),
            Vi(7, 'input', 16),
            Hi('click', function () {
              return Be(t), qi().save()
            }),
            ji(),
            ji(),
            Vi(8, 'td'),
            Vi(9, 'input', 17),
            Hi('click', function () {
              return Be(t), qi().cancel()
            }),
            ji(),
            ji()
        }
        if (2 & t) {
          const t = e.$implicit,
            n = qi()
          Tr(1),
            so(Ea(2, 2, t.created, 'dd/MM/yyyy HH:mm')),
            Tr(3),
            Ni('ngModel', n.edited.coupon)
        }
      }
      let $y = (() => {
        class t {
          constructor (t, e) {
            ;(this.serv = t),
              (this.router = e),
              (this.payments = new Array()),
              (this.edited = null),
              (this.isNew = !1)
          }
          ngOnInit () {
            this.loadPayments()
          }
          loadTemplate (t) {
            return this.edited && this.edited.id == t.id
              ? this.editTemplate
              : this.readOnlyTemplate
          }
          add () {
            this.isNew ||
              ((this.edited = new Py(null, null, '', null, new Date())),
              this.payments.push(this.edited),
              (this.isNew = !0))
          }
          cancel () {
            this.isNew && (this.payments.pop(), (this.isNew = !1)),
              (this.edited = null),
              this.loadPayments()
          }
          save () {
            this.edited.coupon
              ? this.serv.savePayment(this.edited).subscribe(
                  t => {
                    ;(this.isNew = !1),
                      (this.edited = null),
                      this.loadPayments()
                  },
                  t => {
                    let e = t.status
                    ;[401, 403].includes(e)
                      ? this.router.navigate([''])
                      : 404 == e
                      ? (alert('Coupon ' + this.edited.coupon + ' not found.'),
                        this.cancel())
                      : alert('Error: ' + e)
                  }
                )
              : this.cancel()
          }
          loadPayments () {
            this.serv.getPayments().subscribe(
              t => {
                this.payments = t
              },
              t => {
                let e = t.status
                ;[401, 403].includes(e)
                  ? this.router.navigate([''])
                  : alert('Error: ' + e)
              }
            )
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Pi(Ry), Pi(Wp))
          }),
          (t.ɵcmp = ce({
            type: t,
            selectors: [['app-payments']],
            viewQuery: function (t, e) {
              var n
              1 & t && (La(Ny, !0), La(Dy, !0)),
                2 & t &&
                  (Ua((n = $a())) && (e.readOnlyTemplate = n.first),
                  Ua((n = $a())) && (e.editTemplate = n.first))
            },
            features: [Eo([Ry])],
            decls: 43,
            vars: 1,
            consts: [
              [1, 'table'],
              [2, 'width', '10%'],
              ['href', '/map'],
              ['href', '/launch'],
              ['href', '/session'],
              ['href', '/tournament'],
              ['href', '/profile'],
              [2, 'width', '60%'],
              ['href', '/'],
              [
                'type',
                'button',
                'value',
                'Add Coupon',
                1,
                'btn',
                'btn-default',
                'scopeButton',
                3,
                'click'
              ],
              [1, 'table', 'table-striped'],
              [4, 'ngFor', 'ngForOf'],
              ['readOnlyTemplate', ''],
              ['editTemplate', ''],
              [3, 'ngTemplateOutlet', 'ngTemplateOutletContext'],
              [
                'type',
                'text',
                1,
                'form-control',
                3,
                'ngModel',
                'ngModelChange'
              ],
              [
                'type',
                'button',
                'value',
                'Save',
                1,
                'btn',
                'btn-success',
                3,
                'click'
              ],
              [
                'type',
                'button',
                'value',
                'Cancel',
                1,
                'btn',
                'btn-warning',
                3,
                'click'
              ]
            ],
            template: function (t, e) {
              1 & t &&
                (Vi(0, 'table', 0),
                Vi(1, 'thead'),
                Vi(2, 'tr'),
                Vi(3, 'th', 1),
                Vi(4, 'a', 2),
                ro(5, 'Games'),
                ji(),
                ji(),
                Vi(6, 'th', 1),
                Vi(7, 'a', 3),
                ro(8, 'Launch'),
                ji(),
                ji(),
                Vi(9, 'th', 1),
                Vi(10, 'a', 4),
                ro(11, 'Sessions'),
                ji(),
                ji(),
                Vi(12, 'th', 1),
                Vi(13, 'a', 5),
                ro(14, 'Tournaments'),
                ji(),
                ji(),
                Vi(15, 'th', 1),
                Vi(16, 'b'),
                ro(17, 'Payments'),
                ji(),
                ji(),
                Vi(18, 'th', 1),
                Vi(19, 'a', 6),
                ro(20, 'Profile'),
                ji(),
                ji(),
                Vi(21, 'th', 7),
                Vi(22, 'a', 8),
                ro(23, 'Log Out'),
                ji(),
                ji(),
                ji(),
                ji(),
                ji(),
                Vi(24, 'h3'),
                Vi(25, 'input', 9),
                Hi('click', function () {
                  return e.add()
                }),
                ji(),
                ji(),
                Vi(26, 'table', 10),
                Vi(27, 'thead'),
                Vi(28, 'tr'),
                Vi(29, 'td'),
                ro(30, 'Date'),
                ji(),
                Vi(31, 'td'),
                ro(32, 'Code'),
                ji(),
                Vi(33, 'td'),
                ro(34, 'Amount'),
                ji(),
                Fi(35, 'td'),
                Fi(36, 'td'),
                ji(),
                ji(),
                Vi(37, 'tbody'),
                Ii(38, Fy, 2, 4, 'tr', 11),
                ji(),
                ji(),
                Ii(39, Uy, 9, 6, 'ng-template', null, 12, Ga),
                Ii(41, Ly, 10, 5, 'ng-template', null, 13, Ga)),
                2 & t && (Tr(38), Ni('ngForOf', e.payments))
            },
            directives: [Wu, Yu, eg, lg, gm],
            pipes: [tc],
            styles: ['']
          })),
          t
        )
      })()
      function Hy (t, e) {
        return n => {
          const r = n.controls[e]
          ;(r.errors && !r.errors.mustMatch) ||
            r.setErrors(
              n.controls[t].value !== r.value ? { mustMatch: !0 } : null
            )
        }
      }
      let Gy = (() => {
        class t {
          constructor (t) {
            ;(this.http = t), (this.user = 'api/users/current')
          }
          getProfile () {
            return this.http.get(this.user)
          }
          changeProfile (t, e) {
            return this.http.post(this.user, {
              id: t,
              name: e.fio,
              username: e.username,
              password: e.password,
              email: e.mail
            })
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Wt(Pf))
          }),
          (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
          t
        )
      })()
      function zy (t, e) {
        1 & t && (Vi(0, 'div'), ro(1, 'Enter your name'), ji())
      }
      function qy (t, e) {
        if (
          (1 & t && (Vi(0, 'div', 23), Ii(1, zy, 2, 0, 'div', 24), ji()), 2 & t)
        ) {
          const t = qi()
          Tr(1), Ni('ngIf', t.f.fio.errors.required)
        }
      }
      function By (t, e) {
        1 & t && (Vi(0, 'div'), ro(1, 'Enter your login'), ji())
      }
      function Wy (t, e) {
        if (
          (1 & t && (Vi(0, 'div', 23), Ii(1, By, 2, 0, 'div', 24), ji()), 2 & t)
        ) {
          const t = qi()
          Tr(1), Ni('ngIf', t.f.username.errors.required)
        }
      }
      function Zy (t, e) {
        1 & t && (Vi(0, 'div'), ro(1, 'Enter your password'), ji())
      }
      function Qy (t, e) {
        1 & t &&
          (Vi(0, 'div'),
          ro(1, 'Password must be at least 6 characters long'),
          ji())
      }
      function Jy (t, e) {
        if (
          (1 & t &&
            (Vi(0, 'div', 23),
            Ii(1, Zy, 2, 0, 'div', 24),
            Ii(2, Qy, 2, 0, 'div', 24),
            ji()),
          2 & t)
        ) {
          const t = qi()
          Tr(1),
            Ni('ngIf', t.f.password.errors.required),
            Tr(1),
            Ni('ngIf', t.f.password.errors.minlength)
        }
      }
      function Ky (t, e) {
        1 & t && (Vi(0, 'div'), ro(1, 'Enter your password confirmation'), ji())
      }
      function Yy (t, e) {
        1 & t &&
          (Vi(0, 'div'),
          ro(1, 'The confirmation must match the password'),
          ji())
      }
      function Xy (t, e) {
        if (
          (1 & t &&
            (Vi(0, 'div', 23),
            Ii(1, Ky, 2, 0, 'div', 24),
            Ii(2, Yy, 2, 0, 'div', 24),
            ji()),
          2 & t)
        ) {
          const t = qi()
          Tr(1),
            Ni('ngIf', t.f.confirm.errors.required),
            Tr(1),
            Ni('ngIf', t.f.confirm.errors.mustMatch)
        }
      }
      function tv (t, e) {
        1 & t && (Vi(0, 'div'), ro(1, 'Enter your EMail'), ji())
      }
      function ev (t, e) {
        1 & t && (Vi(0, 'div'), ro(1, 'Incorrect Email'), ji())
      }
      function nv (t, e) {
        if (
          (1 & t &&
            (Vi(0, 'div', 23),
            Ii(1, tv, 2, 0, 'div', 24),
            Ii(2, ev, 2, 0, 'div', 24),
            ji()),
          2 & t)
        ) {
          const t = qi()
          Tr(1),
            Ni('ngIf', t.f.mail.errors.required),
            Tr(1),
            Ni('ngIf', t.f.mail.errors.email)
        }
      }
      const rv = function (t) {
        return { 'is-invalid': t }
      }
      let sv = (() => {
          class t {
            constructor (t, e, n) {
              ;(this.formBuilder = t),
                (this.serv = e),
                (this.router = n),
                (this.submitted = !1)
            }
            ngOnInit () {
              ;(this.registerForm = this.formBuilder.group(
                {
                  fio: ['', fg.required],
                  username: ['', fg.required],
                  password: ['', fg.minLength(6)],
                  confirm: [''],
                  mail: ['', [fg.email]]
                },
                { validator: Hy('password', 'confirm') }
              )),
                this.loadProfile()
            }
            get f () {
              return this.registerForm.controls
            }
            loadProfile () {
              this.serv.getProfile().subscribe(
                t => {
                  ;(this.id = t.id),
                    this.f.fio.setValue(t.name),
                    this.f.username.setValue(t.username),
                    this.f.mail.setValue(t.email)
                },
                t => {
                  let e = t.status
                  ;[401, 403].includes(e)
                    ? this.router.navigate([''])
                    : alert('Error: ' + e)
                }
              )
            }
            onKeydownEvent (t) {
              'Enter' === t.key && this.submit()
            }
            submit () {
              ;(this.submitted = !0),
                this.registerForm.invalid
                  ? this.router.navigate(['profile'])
                  : this.serv
                      .changeProfile(this.id, this.registerForm.value)
                      .subscribe(
                        t => {
                          alert('Changes saved')
                        },
                        t => {
                          let e = t.status
                          500 == e
                            ? alert('Account already existed')
                            : [401, 403].includes(e)
                            ? this.router.navigate(['auth'])
                            : alert('Error: ' + e)
                        }
                      )
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Pi(Pm), Pi(Gy), Pi(Wp))
            }),
            (t.ɵcmp = ce({
              type: t,
              selectors: [['app-profile']],
              features: [Eo([Gy])],
              decls: 58,
              vars: 21,
              consts: [
                [1, 'table'],
                [2, 'width', '10%'],
                ['href', '/map'],
                ['href', '/launch'],
                ['href', '/session'],
                ['href', '/tournament'],
                ['href', '/payments'],
                [2, 'width', '60%'],
                ['href', '/'],
                [1, 'jumbotron'],
                [1, 'container'],
                [1, 'row'],
                [1, 'col-md-6', 'offset-md-3'],
                [1, 'profile-form'],
                ['novalidate', '', 3, 'formGroup', 'ngSubmit'],
                [1, 'form-group'],
                [
                  'type',
                  'text',
                  'formControlName',
                  'fio',
                  1,
                  'form-control',
                  3,
                  'ngClass'
                ],
                ['class', 'invalid-feedback', 4, 'ngIf'],
                [
                  'type',
                  'text',
                  'formControlName',
                  'username',
                  1,
                  'form-control',
                  3,
                  'ngClass'
                ],
                [
                  'type',
                  'password',
                  'formControlName',
                  'password',
                  1,
                  'form-control',
                  3,
                  'ngClass'
                ],
                [
                  'type',
                  'password',
                  'formControlName',
                  'confirm',
                  1,
                  'form-control',
                  3,
                  'ngClass',
                  'keydown'
                ],
                [
                  'type',
                  'text',
                  'formControlName',
                  'mail',
                  1,
                  'form-control',
                  3,
                  'ngClass',
                  'keydown'
                ],
                [1, 'btn', 'btn-primary'],
                [1, 'invalid-feedback'],
                [4, 'ngIf']
              ],
              template: function (t, e) {
                1 & t &&
                  (Vi(0, 'table', 0),
                  Vi(1, 'thead'),
                  Vi(2, 'tr'),
                  Vi(3, 'th', 1),
                  Vi(4, 'a', 2),
                  ro(5, 'Games'),
                  ji(),
                  ji(),
                  Vi(6, 'th', 1),
                  Vi(7, 'a', 3),
                  ro(8, 'Launch'),
                  ji(),
                  ji(),
                  Vi(9, 'th', 1),
                  Vi(10, 'a', 4),
                  ro(11, 'Sessions'),
                  ji(),
                  ji(),
                  Vi(12, 'th', 1),
                  Vi(13, 'a', 5),
                  ro(14, 'Tournaments'),
                  ji(),
                  ji(),
                  Vi(15, 'th', 1),
                  Vi(16, 'a', 6),
                  ro(17, 'Payments'),
                  ji(),
                  ji(),
                  Vi(18, 'th', 1),
                  Vi(19, 'b'),
                  ro(20, 'Profile'),
                  ji(),
                  ji(),
                  Vi(21, 'th', 7),
                  Vi(22, 'a', 8),
                  ro(23, 'Log Out'),
                  ji(),
                  ji(),
                  ji(),
                  ji(),
                  ji(),
                  Vi(24, 'div', 9),
                  Vi(25, 'div', 10),
                  Vi(26, 'div', 11),
                  Vi(27, 'div', 12),
                  Vi(28, 'div', 13),
                  Vi(29, 'form', 14),
                  Hi('ngSubmit', function () {
                    return e.submit()
                  }),
                  Vi(30, 'div', 15),
                  Vi(31, 'label'),
                  ro(32, 'Name'),
                  ji(),
                  Fi(33, 'input', 16),
                  Ii(34, qy, 2, 1, 'div', 17),
                  ji(),
                  Vi(35, 'div', 15),
                  Vi(36, 'label'),
                  ro(37, 'Login'),
                  ji(),
                  Fi(38, 'input', 18),
                  Ii(39, Wy, 2, 1, 'div', 17),
                  ji(),
                  Vi(40, 'div', 15),
                  Vi(41, 'label'),
                  ro(42, 'Password'),
                  ji(),
                  Fi(43, 'input', 19),
                  Ii(44, Jy, 3, 2, 'div', 17),
                  ji(),
                  Vi(45, 'div', 15),
                  Vi(46, 'label'),
                  ro(47, 'Confirmation'),
                  ji(),
                  Vi(48, 'input', 20),
                  Hi('keydown', function (t) {
                    return e.onKeydownEvent(t)
                  }),
                  ji(),
                  Ii(49, Xy, 3, 2, 'div', 17),
                  ji(),
                  Vi(50, 'div', 15),
                  Vi(51, 'label'),
                  ro(52, 'EMail'),
                  ji(),
                  Vi(53, 'input', 21),
                  Hi('keydown', function (t) {
                    return e.onKeydownEvent(t)
                  }),
                  ji(),
                  Ii(54, nv, 3, 2, 'div', 17),
                  ji(),
                  Vi(55, 'div', 15),
                  Vi(56, 'button', 22),
                  ro(57, 'Save changes'),
                  ji(),
                  ji(),
                  ji(),
                  ji(),
                  ji(),
                  ji(),
                  ji(),
                  ji()),
                  2 & t &&
                    (Tr(29),
                    Ni('formGroup', e.registerForm),
                    Tr(4),
                    Ni('ngClass', wa(11, rv, e.submitted && e.f.fio.errors)),
                    Tr(1),
                    Ni('ngIf', e.submitted && e.f.fio.errors),
                    Tr(4),
                    Ni(
                      'ngClass',
                      wa(13, rv, e.submitted && e.f.username.errors)
                    ),
                    Tr(1),
                    Ni('ngIf', e.submitted && e.f.username.errors),
                    Tr(4),
                    Ni(
                      'ngClass',
                      wa(15, rv, e.submitted && e.f.password.errors)
                    ),
                    Tr(1),
                    Ni('ngIf', e.submitted && e.f.password.errors),
                    Tr(4),
                    Ni(
                      'ngClass',
                      wa(17, rv, e.submitted && e.f.confirm.errors)
                    ),
                    Tr(1),
                    Ni('ngIf', e.submitted && e.f.confirm.errors),
                    Tr(4),
                    Ni('ngClass', wa(19, rv, e.submitted && e.f.mail.errors)),
                    Tr(1),
                    Ni('ngIf', e.submitted && e.f.mail.errors))
              },
              directives: [mm, ug, _m, eg, lg, Tm, qu, Qu],
              styles: ['']
            })),
            t
          )
        })(),
        iv = (() => {
          class t {
            constructor (t) {
              ;(this.http = t), (this.url = '/api/users')
            }
            addUser (t) {
              return this.http.post(this.url, {
                realm: 1,
                name: t.fio,
                is_admin: 0,
                username: t.username,
                password: t.password
              })
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)(Wt(Pf))
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })()
      function ov (t, e) {
        1 & t && (Vi(0, 'div'), ro(1, 'Enter your name'), ji())
      }
      function av (t, e) {
        if (
          (1 & t && (Vi(0, 'div', 14), Ii(1, ov, 2, 0, 'div', 15), ji()), 2 & t)
        ) {
          const t = qi()
          Tr(1), Ni('ngIf', t.f.fio.errors.required)
        }
      }
      function lv (t, e) {
        1 & t && (Vi(0, 'div'), ro(1, 'Enter your login'), ji())
      }
      function uv (t, e) {
        if (
          (1 & t && (Vi(0, 'div', 14), Ii(1, lv, 2, 0, 'div', 15), ji()), 2 & t)
        ) {
          const t = qi()
          Tr(1), Ni('ngIf', t.f.username.errors.required)
        }
      }
      function cv (t, e) {
        1 & t && (Vi(0, 'div'), ro(1, 'Enter your password'), ji())
      }
      function hv (t, e) {
        1 & t &&
          (Vi(0, 'div'),
          ro(1, 'Password must be at least 6 characters long'),
          ji())
      }
      function dv (t, e) {
        if (
          (1 & t &&
            (Vi(0, 'div', 14),
            Ii(1, cv, 2, 0, 'div', 15),
            Ii(2, hv, 2, 0, 'div', 15),
            ji()),
          2 & t)
        ) {
          const t = qi()
          Tr(1),
            Ni('ngIf', t.f.password.errors.required),
            Tr(1),
            Ni('ngIf', t.f.password.errors.minlength)
        }
      }
      function pv (t, e) {
        1 & t && (Vi(0, 'div'), ro(1, 'Enter your password confirmation'), ji())
      }
      function fv (t, e) {
        1 & t &&
          (Vi(0, 'div'),
          ro(1, 'The confirmation must match the password'),
          ji())
      }
      function gv (t, e) {
        if (
          (1 & t &&
            (Vi(0, 'div', 14),
            Ii(1, pv, 2, 0, 'div', 15),
            Ii(2, fv, 2, 0, 'div', 15),
            ji()),
          2 & t)
        ) {
          const t = qi()
          Tr(1),
            Ni('ngIf', t.f.confirm.errors.required),
            Tr(1),
            Ni('ngIf', t.f.confirm.errors.mustMatch)
        }
      }
      const mv = function (t) {
        return { 'is-invalid': t }
      }
      let yv = (() => {
        class t {
          constructor (t, e, n) {
            ;(this.formBuilder = t),
              (this.serv = e),
              (this.router = n),
              (this.submitted = !1)
          }
          ngOnInit () {
            this.registerForm = this.formBuilder.group(
              {
                fio: ['', fg.required],
                username: ['', fg.required],
                password: ['', [fg.required, fg.minLength(6)]],
                confirm: ['', fg.required]
              },
              { validator: Hy('password', 'confirm') }
            )
          }
          get f () {
            return this.registerForm.controls
          }
          onKeydownEvent (t) {
            'Enter' === t.key && this.submit()
          }
          submit () {
            ;(this.submitted = !0),
              this.registerForm.invalid ||
                this.serv.addUser(this.registerForm.value).subscribe(
                  t => {
                    alert('Account registered'), this.router.navigate(['auth'])
                  },
                  t => {
                    let e = t.status
                    409 == e
                      ? alert('Account already existed')
                      : alert('Error: ' + e)
                  }
                )
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Pi(Pm), Pi(iv), Pi(Wp))
          }),
          (t.ɵcmp = ce({
            type: t,
            selectors: [['app-reg']],
            decls: 31,
            vars: 17,
            consts: [
              [1, 'jumbotron'],
              [1, 'container'],
              [1, 'row'],
              [1, 'col-md-6', 'offset-md-3'],
              ['href', '/auth', 1, 'pull-right'],
              [1, 'registre-form'],
              ['novalidate', '', 3, 'formGroup', 'ngSubmit'],
              [1, 'form-group'],
              [
                'type',
                'text',
                'formControlName',
                'fio',
                1,
                'form-control',
                3,
                'ngClass'
              ],
              ['class', 'invalid-feedback', 4, 'ngIf'],
              [
                'type',
                'text',
                'formControlName',
                'username',
                1,
                'form-control',
                3,
                'ngClass'
              ],
              [
                'type',
                'password',
                'formControlName',
                'password',
                1,
                'form-control',
                3,
                'ngClass'
              ],
              [
                'type',
                'password',
                'formControlName',
                'confirm',
                1,
                'form-control',
                3,
                'ngClass',
                'keydown'
              ],
              [1, 'btn', 'btn-primary'],
              [1, 'invalid-feedback'],
              [4, 'ngIf']
            ],
            template: function (t, e) {
              1 & t &&
                (Vi(0, 'div', 0),
                Vi(1, 'div', 1),
                Vi(2, 'div', 2),
                Vi(3, 'div', 3),
                Vi(4, 'a', 4),
                ro(5, 'Log In'),
                ji(),
                Vi(6, 'div', 5),
                Vi(7, 'form', 6),
                Hi('ngSubmit', function () {
                  return e.submit()
                }),
                Vi(8, 'div', 7),
                Vi(9, 'label'),
                ro(10, 'Name'),
                ji(),
                Fi(11, 'input', 8),
                Ii(12, av, 2, 1, 'div', 9),
                ji(),
                Vi(13, 'div', 7),
                Vi(14, 'label'),
                ro(15, 'Login'),
                ji(),
                Fi(16, 'input', 10),
                Ii(17, uv, 2, 1, 'div', 9),
                ji(),
                Vi(18, 'div', 7),
                Vi(19, 'label'),
                ro(20, 'Password'),
                ji(),
                Fi(21, 'input', 11),
                Ii(22, dv, 3, 2, 'div', 9),
                ji(),
                Vi(23, 'div', 7),
                Vi(24, 'label'),
                ro(25, 'Confirmation'),
                ji(),
                Vi(26, 'input', 12),
                Hi('keydown', function (t) {
                  return e.onKeydownEvent(t)
                }),
                ji(),
                Ii(27, gv, 3, 2, 'div', 9),
                ji(),
                Vi(28, 'div', 7),
                Vi(29, 'button', 13),
                ro(30, 'Sign Up'),
                ji(),
                ji(),
                ji(),
                ji(),
                ji(),
                ji(),
                ji(),
                ji()),
                2 & t &&
                  (Tr(7),
                  Ni('formGroup', e.registerForm),
                  Tr(4),
                  Ni('ngClass', wa(9, mv, e.submitted && e.f.fio.errors)),
                  Tr(1),
                  Ni('ngIf', e.submitted && e.f.fio.errors),
                  Tr(4),
                  Ni('ngClass', wa(11, mv, e.submitted && e.f.username.errors)),
                  Tr(1),
                  Ni('ngIf', e.submitted && e.f.username.errors),
                  Tr(4),
                  Ni('ngClass', wa(13, mv, e.submitted && e.f.password.errors)),
                  Tr(1),
                  Ni('ngIf', e.submitted && e.f.password.errors),
                  Tr(4),
                  Ni('ngClass', wa(15, mv, e.submitted && e.f.confirm.errors)),
                  Tr(1),
                  Ni('ngIf', e.submitted && e.f.confirm.errors))
            },
            directives: [mm, ug, _m, eg, lg, Tm, qu, Qu],
            styles: ['']
          })),
          t
        )
      })()
      class vv extends h {
        constructor (t, e) {
          super()
        }
        schedule (t, e = 0) {
          return this
        }
      }
      class _v extends vv {
        constructor (t, e) {
          super(t, e),
            (this.scheduler = t),
            (this.work = e),
            (this.pending = !1)
        }
        schedule (t, e = 0) {
          if (this.closed) return this
          this.state = t
          const n = this.id,
            r = this.scheduler
          return (
            null != n && (this.id = this.recycleAsyncId(r, n, e)),
            (this.pending = !0),
            (this.delay = e),
            (this.id = this.id || this.requestAsyncId(r, this.id, e)),
            this
          )
        }
        requestAsyncId (t, e, n = 0) {
          return setInterval(t.flush.bind(t, this), n)
        }
        recycleAsyncId (t, e, n = 0) {
          if (null !== n && this.delay === n && !1 === this.pending) return e
          clearInterval(e)
        }
        execute (t, e) {
          if (this.closed) return new Error('executing a cancelled action')
          this.pending = !1
          const n = this._execute(t, e)
          if (n) return n
          !1 === this.pending &&
            null != this.id &&
            (this.id = this.recycleAsyncId(this.scheduler, this.id, null))
        }
        _execute (t, e) {
          let n = !1,
            r = void 0
          try {
            this.work(t)
          } catch (s) {
            ;(n = !0), (r = (!!s && s) || new Error(s))
          }
          if (n) return this.unsubscribe(), r
        }
        _unsubscribe () {
          const t = this.id,
            e = this.scheduler,
            n = e.actions,
            r = n.indexOf(this)
          ;(this.work = null),
            (this.state = null),
            (this.pending = !1),
            (this.scheduler = null),
            -1 !== r && n.splice(r, 1),
            null != t && (this.id = this.recycleAsyncId(e, t, null)),
            (this.delay = null)
        }
      }
      let wv = (() => {
        class t {
          constructor (e, n = t.now) {
            ;(this.SchedulerAction = e), (this.now = n)
          }
          schedule (t, e = 0, n) {
            return new this.SchedulerAction(this, t).schedule(n, e)
          }
        }
        return (t.now = () => Date.now()), t
      })()
      class bv extends wv {
        constructor (t, e = wv.now) {
          super(t, () =>
            bv.delegate && bv.delegate !== this ? bv.delegate.now() : e()
          ),
            (this.actions = []),
            (this.active = !1),
            (this.scheduled = void 0)
        }
        schedule (t, e = 0, n) {
          return bv.delegate && bv.delegate !== this
            ? bv.delegate.schedule(t, e, n)
            : super.schedule(t, e, n)
        }
        flush (t) {
          const { actions: e } = this
          if (this.active) return void e.push(t)
          let n
          this.active = !0
          do {
            if ((n = t.execute(t.state, t.delay))) break
          } while ((t = e.shift()))
          if (((this.active = !1), n)) {
            for (; (t = e.shift()); ) t.unsubscribe()
            throw n
          }
        }
      }
      const Cv = new bv(_v)
      function Sv (t) {
        return !l(t) && t - parseFloat(t) + 1 >= 0
      }
      function xv (t) {
        const { index: e, period: n, subscriber: r } = t
        if ((r.next(e), !r.closed)) {
          if (-1 === n) return r.complete()
          ;(t.index = e + 1), this.schedule(t, n)
        }
      }
      let Ev = (() => {
        class t {
          constructor (t) {
            ;(this.http = t),
              (this.styles = '/api/game/styles'),
              (this.sess = '/api/session'),
              (this.join = '/api/join')
          }
          getStyles () {
            return this.http.get(this.styles)
          }
          getSessions (t) {
            return this.http.get(this.sess + '/' + t)
          }
          joinToSession (t) {
            return this.http.post(this.join, { session_id: t })
          }
          delSessions (t) {
            return this.http.delete(this.sess + '/' + t)
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Wt(Pf))
          }),
          (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
          t
        )
      })()
      function Tv (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'select', 12),
            Hi('ngModelChange', function (e) {
              return Be(t), (qi().scope = e)
            })('change', function () {
              return Be(t), qi().changeFilter()
            }),
            Vi(1, 'option', 13),
            ro(2, 'Join to session'),
            ji(),
            Vi(3, 'option', 13),
            ro(4, 'My turn'),
            ji(),
            Vi(5, 'option', 13),
            ro(6, 'Current games'),
            ji(),
            Vi(7, 'option', 13),
            ro(8, 'Archive'),
            ji(),
            Vi(9, 'option', 13),
            ro(10, 'My games'),
            ji(),
            Vi(11, 'option', 13),
            ro(12, 'All games'),
            ji(),
            ji()
        }
        2 & t &&
          (Ni('ngModel', qi().scope),
          Tr(1),
          Ni('value', 1),
          Tr(2),
          Ni('value', 2),
          Tr(2),
          Ni('value', 3),
          Tr(2),
          Ni('value', 4),
          Tr(2),
          Ni('value', 5),
          Tr(2),
          Ni('value', 6))
      }
      function kv (t, e) {
        if ((1 & t && (Vi(0, 'option', 13), ro(1), ji()), 2 & t)) {
          const t = e.$implicit
          Ni('value', t.id), Tr(1), io(' ', t.name, ' ')
        }
      }
      function Av (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'div'),
            Vi(1, 'select', 16),
            Hi('ngModelChange', function (e) {
              return Be(t), (qi().$implicit.style = e)
            })('change', function () {
              Be(t)
              const e = qi().$implicit
              return qi().changeStyle(e)
            }),
            Ii(2, kv, 2, 2, 'option', 17),
            ji(),
            ji()
        }
        if (2 & t) {
          const t = qi().$implicit,
            e = qi()
          Tr(1),
            Ni('ngModel', t.style),
            Tr(1),
            Ni('ngForOf', e.getStyles(t.game_id))
        }
      }
      function Ov (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'div'),
            Vi(1, 'input', 18),
            Hi('click', function () {
              Be(t)
              const e = qi().$implicit
              return qi().delete(e)
            }),
            ji(),
            ji()
        }
      }
      function Iv (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'tr'),
            Vi(1, 'td'),
            ro(2),
            xa(3, 'date'),
            ji(),
            Vi(4, 'td'),
            ro(5),
            ji(),
            Vi(6, 'td'),
            ro(7),
            ji(),
            Vi(8, 'td'),
            ro(9),
            ji(),
            Vi(10, 'td'),
            ro(11),
            ji(),
            Vi(12, 'td'),
            Ii(13, Av, 3, 2, 'div', 14),
            ji(),
            Vi(14, 'td'),
            Vi(15, 'input', 15),
            Hi('click', function () {
              Be(t)
              const n = e.$implicit
              return qi().join(n)
            }),
            ji(),
            ji(),
            Vi(16, 'td'),
            Ii(17, Ov, 2, 0, 'div', 14),
            ji(),
            ji()
        }
        if (2 & t) {
          const t = e.$implicit,
            n = qi()
          Tr(2),
            so(Ea(3, 7, t.created, 'dd/MM/yyyy')),
            Tr(3),
            so(t.game),
            Tr(2),
            so(t.player_name),
            Tr(2),
            so(t.last_turn),
            Tr(2),
            so(t.timecontrol),
            Tr(2),
            Ni('ngIf', n.isStyled(t.game_id)),
            Tr(4),
            Ni('ngIf', n.isRoot())
        }
      }
      let Mv = (() => {
        class t {
          constructor (t, e, n) {
            ;(this.serv = t),
              (this.router = e),
              (this.activateRoute = n),
              (this.sessions = new Array()),
              (this.styles = new Array()),
              (this.start_scope = n.snapshot.params.s),
              (this.start_game = n.snapshot.params.g),
              (this.start_var = n.snapshot.params.v),
              this.initScope()
          }
          ngOnInit () {
            this.loadStyles(),
              (function (t = 0, e, n) {
                let r = -1
                return (
                  Sv(e) ? (r = Number(e) < 1 ? 1 : Number(e)) : k(e) && (n = e),
                  k(n) || (n = Cv),
                  new w(e => {
                    const s = Sv(t) ? t : +t - n.now()
                    return n.schedule(xv, s, {
                      index: 0,
                      period: r,
                      subscriber: e
                    })
                  })
                )
              })(6e4, 6e4).subscribe(() => {
                this.loadSessions()
              })
          }
          loadStyles () {
            this.serv.getStyles().subscribe(
              t => {
                ;(this.styles = t), this.loadSessions()
              },
              t => {
                let e = t.status
                ;[401, 403].includes(e)
                  ? this.router.navigate([''])
                  : alert('Error: ' + e)
              }
            )
          }
          getStyles (t) {
            return this.styles.filter(e => e.game_id == t)
          }
          isStyled (t) {
            return this.getStyles(t).length > 0
          }
          getScope () {
            return 1 == this.scope
              ? 'waiting'
              : 2 == this.scope
              ? 'current'
              : 3 == this.scope
              ? 'active'
              : 4 == this.scope
              ? 'archive'
              : 5 == this.scope
              ? 'my'
              : 'all'
          }
          initScope () {
            if (this.start_scope) return void (this.scope = this.start_scope)
            const t = localStorage.getItem('mySessionScope')
            this.scope = t ? +t : 1
          }
          changeFilter () {
            localStorage.setItem('mySessionScope', '' + this.scope),
              this.loadSessions()
          }
          changeStyle (t) {
            const e = this.styles.filter(e => e.id == t.style)
            e.length > 0 && localStorage.setItem('myCurrStyle', e[0].suffix)
          }
          initStyle (t) {
            const e = this.getStyles(t.game_id),
              n = localStorage.getItem('myCurrStyle')
            if (n) {
              const r = e.filter(t => t.suffix == n)
              if (r.length > 0) return void (t.style = r[0].id)
            }
            e.length > 0 && (t.style = e[0].id)
          }
          loadSessions () {
            let t = this.getScope()
            this.start_game &&
              ((t = t + '/' + this.start_game),
              this.start_var && (t = t + '/' + this.start_var)),
              this.serv.getSessions(t).subscribe(
                t => {
                  t.forEach(t => {
                    this.initStyle(t)
                  }),
                    (this.sessions = t)
                },
                t => {
                  let e = t.status
                  ;[401, 403].includes(e)
                    ? this.router.navigate([''])
                    : alert('Error: ' + e)
                }
              )
          }
          join (t) {
            if (1 == this.scope) {
              if (!confirm('Join to Session?')) return
              this.serv.joinToSession(t.id).subscribe(
                e => {
                  this.loadSessions(), this.launch(t, e.filename)
                },
                t => {
                  let e = t.status
                  404 != e &&
                    ([401, 403].includes(e)
                      ? this.router.navigate([''])
                      : alert('Error: ' + e))
                }
              )
            } else this.launch(t, t.filename)
          }
          launch (t, e) {
            let n = '/yahia/' + e
            const r = this.styles.filter(e => t.style == e.id)
            r.length && (n += r[0].suffix),
              t.ai && (n += '-ai'),
              (n = n + '.html?sid=' + t.id),
              t.selector_value > 0 && (n = n + '&selector=' + t.selector_value),
              n && (window.location.href = n)
          }
          delete (t) {
            confirm('Delele Session?') &&
              this.serv.delSessions(t.id).subscribe(
                t => {
                  this.loadSessions()
                },
                t => {
                  let e = t.status
                  ;[401, 403].includes(e)
                    ? this.router.navigate([''])
                    : alert('Error: ' + e)
                }
              )
          }
          isRoot () {
            return '1' == localStorage.getItem('myRole')
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Pi(Ev), Pi(Wp), Pi(Ud))
          }),
          (t.ɵcmp = ce({
            type: t,
            selectors: [['app-session']],
            features: [Eo([Ev])],
            decls: 46,
            vars: 2,
            consts: [
              [1, 'table'],
              [2, 'width', '10%'],
              ['href', '/map'],
              ['href', '/launch'],
              ['href', '/tournament'],
              ['href', '/payments'],
              ['href', '/profile'],
              [2, 'width', '60%'],
              ['href', '/'],
              [
                'class',
                'scopeCombobox',
                'name',
                'scope',
                3,
                'ngModel',
                'ngModelChange',
                'change',
                4,
                'ngIf'
              ],
              [1, 'table', 'table-striped'],
              [4, 'ngFor', 'ngForOf'],
              [
                'name',
                'scope',
                1,
                'scopeCombobox',
                3,
                'ngModel',
                'ngModelChange',
                'change'
              ],
              [3, 'value'],
              [4, 'ngIf'],
              [
                'type',
                'button',
                'value',
                'Join',
                1,
                'btn',
                'btn-success',
                3,
                'click'
              ],
              [
                'name',
                'it.style',
                1,
                'form-control',
                3,
                'ngModel',
                'ngModelChange',
                'change'
              ],
              [3, 'value', 4, 'ngFor', 'ngForOf'],
              [
                'type',
                'button',
                'value',
                'Delete',
                1,
                'btn',
                'btn-danger',
                3,
                'click'
              ]
            ],
            template: function (t, e) {
              1 & t &&
                (Vi(0, 'table', 0),
                Vi(1, 'thead'),
                Vi(2, 'tr'),
                Vi(3, 'th', 1),
                Vi(4, 'a', 2),
                ro(5, 'Games'),
                ji(),
                ji(),
                Vi(6, 'th', 1),
                Vi(7, 'a', 3),
                ro(8, 'Launch'),
                ji(),
                ji(),
                Vi(9, 'th', 1),
                Vi(10, 'b'),
                ro(11, 'Sessions'),
                ji(),
                ji(),
                Vi(12, 'th', 1),
                Vi(13, 'a', 4),
                ro(14, 'Tournaments'),
                ji(),
                ji(),
                Vi(15, 'th', 1),
                Vi(16, 'a', 5),
                ro(17, 'Payments'),
                ji(),
                ji(),
                Vi(18, 'th', 1),
                Vi(19, 'a', 6),
                ro(20, 'Profile'),
                ji(),
                ji(),
                Vi(21, 'th', 7),
                Vi(22, 'a', 8),
                ro(23, 'Log Out'),
                ji(),
                ji(),
                ji(),
                ji(),
                ji(),
                Vi(24, 'h3'),
                ro(25, 'Watch sessions\n'),
                Ii(26, Tv, 13, 7, 'select', 9),
                ji(),
                Vi(27, 'table', 10),
                Vi(28, 'thead'),
                Vi(29, 'tr'),
                Vi(30, 'td'),
                ro(31, 'Date'),
                ji(),
                Vi(32, 'td'),
                ro(33, 'Game'),
                ji(),
                Vi(34, 'td'),
                ro(35, 'Player'),
                ji(),
                Vi(36, 'td'),
                ro(37, 'Turns'),
                ji(),
                Vi(38, 'td'),
                ro(39, 'Time Control'),
                ji(),
                Vi(40, 'td'),
                ro(41, 'Style'),
                ji(),
                Fi(42, 'td'),
                Fi(43, 'td'),
                ji(),
                ji(),
                Vi(44, 'tbody'),
                Ii(45, Iv, 18, 10, 'tr', 11),
                ji(),
                ji()),
                2 & t &&
                  (Tr(26),
                  Ni('ngIf', !e.start_game),
                  Tr(19),
                  Ni('ngForOf', e.sessions))
            },
            directives: [Qu, Wu, Rg, lg, gm, Ng, Fg],
            pipes: [tc],
            styles: [
              '.scopeCombobox[_ngcontent-%COMP%]{min-width:260px;max-width:1000px;float:right}'
            ]
          })),
          t
        )
      })()
      class Pv {
        constructor (
          t,
          e,
          n,
          r,
          s,
          i,
          o,
          a,
          l,
          u,
          c,
          h,
          d,
          p,
          f,
          g,
          m,
          y,
          v,
          _
        ) {
          ;(this.id = t),
            (this.title = e),
            (this.is_owner = n),
            (this.is_joined = r),
            (this.game_id = s),
            (this.variant_id = i),
            (this.selector_value = o),
            (this.game = a),
            (this.main_time = l),
            (this.additional_time = u),
            (this.is_hidden = c),
            (this.created = h),
            (this.closed = d),
            (this.user_id = p),
            (this.creator = f),
            (this.all = g),
            (this.completed = m),
            (this.setting_id = y),
            (this.timecontrol_id = v),
            (this.timecontrol = _)
        }
      }
      let Rv = (() => {
        class t {
          constructor (t) {
            ;(this.http = t), (this.tourn = '/api/tournament')
          }
          getInfo () {
            return this.http.get(this.tourn + '/info')
          }
          getTime () {
            return this.http.get(this.tourn + '/time')
          }
          getTourns (t) {
            return this.http.get(this.tourn + '/' + t)
          }
          saveTourn (t) {
            return this.http.post(this.tourn, t)
          }
          joinToTourn (t) {
            return this.http.post(this.tourn + '/join', { id: t })
          }
          delTourn (t) {
            return this.http.delete(this.tourn + '/' + t)
          }
          closeTourn (t) {
            return this.http.post(this.tourn + '/close', { id: t })
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Wt(Pf))
          }),
          (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
          t
        )
      })()
      const Nv = ['readOnlyTemplate'],
        Dv = ['editTemplate']
      function Vv (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'input', 15),
            Hi('click', function () {
              return Be(t), qi().add()
            }),
            ji()
        }
      }
      function jv (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'select', 16),
            Hi('ngModelChange', function (e) {
              return Be(t), (qi().scope = e)
            })('change', function () {
              return Be(t), qi().changeFilter()
            }),
            Vi(1, 'option', 17),
            ro(2, 'Current'),
            ji(),
            Vi(3, 'option', 17),
            ro(4, 'Closed'),
            ji(),
            ji()
        }
        2 & t &&
          (Ni('ngModel', qi().scope),
          Tr(1),
          Ni('value', 1),
          Tr(2),
          Ni('value', 2))
      }
      function Fv (t, e) {}
      const Uv = function (t) {
        return { $implicit: t }
      }
      function Lv (t, e) {
        if (
          (1 & t && (Vi(0, 'tr'), Ii(1, Fv, 0, 0, 'ng-template', 18), ji()),
          2 & t)
        ) {
          const t = e.$implicit,
            n = qi()
          Tr(1),
            Ni('ngTemplateOutlet', n.loadTemplate(t))(
              'ngTemplateOutletContext',
              wa(2, Uv, t)
            )
        }
      }
      function $v (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'input', 23),
            Hi('click', function () {
              Be(t)
              const e = qi().$implicit
              return qi().edit(e)
            }),
            ji()
        }
      }
      function Hv (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'input', 24),
            Hi('click', function () {
              Be(t)
              const e = qi().$implicit
              return qi().delete(e)
            }),
            ji()
        }
      }
      function Gv (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'input', 25),
            Hi('click', function () {
              Be(t)
              const e = qi().$implicit
              return qi().close(e)
            }),
            ji()
        }
      }
      function zv (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'td'),
            ro(1),
            xa(2, 'date'),
            ji(),
            Vi(3, 'td'),
            ro(4),
            ji(),
            Vi(5, 'td'),
            Vi(6, 'a', 19),
            Hi('click', function () {
              Be(t)
              const n = e.$implicit
              return qi().members(n)
            }),
            ro(7),
            ji(),
            ji(),
            Vi(8, 'td'),
            ro(9),
            ji(),
            Vi(10, 'td'),
            Vi(11, 'a', 19),
            Hi('click', function () {
              Be(t)
              const n = e.$implicit
              return qi().games(n)
            }),
            ro(12),
            ji(),
            ji(),
            Vi(13, 'td'),
            Ii(14, $v, 1, 0, 'input', 20),
            ji(),
            Vi(15, 'td'),
            Ii(16, Hv, 1, 0, 'input', 21),
            Ii(17, Gv, 1, 0, 'input', 22),
            ji()
        }
        if (2 & t) {
          const t = e.$implicit,
            n = qi()
          Tr(1),
            so(Ea(2, 9, t.created, 'dd/MM/yyyy')),
            Tr(3),
            so(t.title),
            Tr(3),
            so(t.game),
            Tr(2),
            so(t.timecontrol),
            Tr(3),
            oo('', t.completed, '/', t.all, ''),
            Tr(2),
            Ni('ngIf', !n.isNew && n.isOwner(t)),
            Tr(2),
            Ni('ngIf', n.isRoot()),
            Tr(1),
            Ni('ngIf', !n.isRoot() && n.isOwner(t) && 1 == n.scope)
        }
      }
      function qv (t, e) {
        if ((1 & t && (Vi(0, 'td'), ro(1), ji()), 2 & t)) {
          const t = qi().$implicit
          Tr(1), so(t.game)
        }
      }
      function Bv (t, e) {
        if ((1 & t && (Vi(0, 'option', 17), ro(1), ji()), 2 & t)) {
          const t = e.$implicit
          Ni('value', t.id), Tr(1), io(' ', t.name, ' ')
        }
      }
      function Wv (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'td'),
            Vi(1, 'select', 30),
            Hi('ngModelChange', function (e) {
              return Be(t), (qi(2).edited.setting_id = e)
            }),
            Ii(2, Bv, 2, 2, 'option', 31),
            ji(),
            ji()
        }
        if (2 & t) {
          const t = qi(2)
          Tr(1),
            Ni('ngModel', t.edited.setting_id),
            Tr(1),
            Ni('ngForOf', t.info)
        }
      }
      function Zv (t, e) {
        if ((1 & t && (Vi(0, 'td'), ro(1), ji()), 2 & t)) {
          const t = qi().$implicit
          Tr(1), so(t.timecontrol)
        }
      }
      function Qv (t, e) {
        if ((1 & t && (Vi(0, 'option', 17), ro(1), ji()), 2 & t)) {
          const t = e.$implicit
          Ni('value', t.id), Tr(1), io(' ', t.name, ' ')
        }
      }
      function Jv (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'td'),
            Vi(1, 'select', 32),
            Hi('ngModelChange', function (e) {
              return Be(t), (qi(2).edited.timecontrol_id = e)
            }),
            Ii(2, Qv, 2, 2, 'option', 31),
            ji(),
            ji()
        }
        if (2 & t) {
          const t = qi(2)
          Tr(1),
            Ni('ngModel', t.edited.timecontrol_id),
            Tr(1),
            Ni('ngForOf', t.timecontrol)
        }
      }
      function Kv (t, e) {
        if (1 & t) {
          const t = Ui()
          Vi(0, 'td'),
            ro(1),
            xa(2, 'date'),
            ji(),
            Vi(3, 'td'),
            Vi(4, 'input', 26),
            Hi('ngModelChange', function (e) {
              return Be(t), (qi().edited.title = e)
            }),
            ji(),
            ji(),
            Ii(5, qv, 2, 1, 'td', 27),
            Ii(6, Wv, 3, 2, 'td', 27),
            Ii(7, Zv, 2, 1, 'td', 27),
            Ii(8, Jv, 3, 2, 'td', 27),
            Vi(9, 'td'),
            ro(10),
            ji(),
            Vi(11, 'td'),
            Vi(12, 'input', 28),
            Hi('click', function () {
              return Be(t), qi().save()
            }),
            ji(),
            ji(),
            Vi(13, 'td'),
            Vi(14, 'input', 29),
            Hi('click', function () {
              return Be(t), qi().cancel()
            }),
            ji(),
            ji()
        }
        if (2 & t) {
          const t = e.$implicit,
            n = qi()
          Tr(1),
            so(Ea(2, 8, t.created, 'dd/MM/yyyy')),
            Tr(3),
            Ni('ngModel', n.edited.title),
            Tr(1),
            Ni('ngIf', !n.isNew),
            Tr(1),
            Ni('ngIf', n.isNew),
            Tr(1),
            Ni('ngIf', !n.isNew),
            Tr(1),
            Ni('ngIf', n.isNew),
            Tr(2),
            oo('', t.completed, '/', t.all, '')
        }
      }
      let Yv = (() => {
        class t {
          constructor (t, e, n) {
            ;(this.serv = t),
              (this.router = e),
              (this.activateRoute = n),
              (this.scope = 1),
              (this.info = new Array()),
              (this.timecontrol = new Array()),
              (this.tourns = new Array()),
              (this.start_game = n.snapshot.params.g),
              (this.start_var = n.snapshot.params.v),
              (this.edited = null),
              (this.isNew = !1)
          }
          ngOnInit () {
            this.loadTime()
          }
          loadTemplate (t) {
            return this.edited && this.edited.id == t.id
              ? this.editTemplate
              : this.readOnlyTemplate
          }
          add () {
            ;(this.edited = new Pv(
              null,
              '',
              !1,
              !1,
              null,
              null,
              null,
              '',
              null,
              null,
              !1,
              new Date(),
              null,
              null,
              '',
              0,
              0,
              null,
              null,
              ''
            )),
              this.tourns.push(this.edited),
              (this.isNew = !0)
          }
          edit (t) {
            this.edited = t
          }
          cancel () {
            this.isNew && (this.tourns.pop(), (this.isNew = !1)),
              (this.edited = null),
              this.loadTurns()
          }
          save () {
            this.edited.title && this.edited.setting_id
              ? this.serv.saveTourn(this.edited).subscribe(
                  t => {
                    this.isNew && (this.scope = 1),
                      (this.isNew = !1),
                      (this.edited = null),
                      this.loadTurns()
                  },
                  t => {
                    let e = t.status
                    ;[401, 403].includes(e)
                      ? this.router.navigate([''])
                      : alert('Error: ' + e)
                  }
                )
              : this.cancel()
          }
          changeFilter () {
            this.loadTurns()
          }
          isStarted (t) {
            return t.all > 0
          }
          isJoined (t) {
            return t.is_joined
          }
          isOwner (t) {
            return t.is_owner
          }
          members (t) {
            this.router.navigate(['members/' + t.id])
          }
          games (t) {
            this.router.navigate(['games/' + t.id])
          }
          join (t) {
            confirm('Join to Tournament?') &&
              this.serv.joinToTourn(t.id).subscribe(
                t => {
                  this.loadTurns()
                },
                t => {
                  let e = t.status
                  ;[401, 403].includes(e)
                    ? this.router.navigate([''])
                    : alert('Error: ' + e)
                }
              )
          }
          delete (t) {
            confirm('Delete Tournament?') &&
              this.serv.delTourn(t.id).subscribe(
                t => {
                  this.loadTurns()
                },
                t => {
                  let e = t.status
                  ;[401, 403].includes(e)
                    ? this.router.navigate([''])
                    : alert('Error: ' + e)
                }
              )
          }
          close (t) {
            confirm('Close Tournament?') &&
              this.serv.closeTourn(t.id).subscribe(
                t => {
                  this.loadTurns()
                },
                t => {
                  let e = t.status
                  ;[401, 403].includes(e)
                    ? this.router.navigate([''])
                    : alert('Error: ' + e)
                }
              )
          }
          loadTime () {
            this.serv.getTime().subscribe(
              t => {
                ;(this.timecontrol = t), this.loadInfo()
              },
              t => {
                let e = t.status
                ;[401, 403].includes(e)
                  ? this.router.navigate([''])
                  : alert('Error: ' + e)
              }
            )
          }
          loadInfo () {
            this.serv.getInfo().subscribe(
              t => {
                ;(this.info = t), this.loadTurns()
              },
              t => {
                let e = t.status
                ;[401, 403].includes(e)
                  ? this.router.navigate([''])
                  : alert('Error: ' + e)
              }
            )
          }
          loadTurns () {
            let t = 1 == this.scope ? 'active' : 'closed'
            this.start_game &&
              ((t = 'game/' + this.start_game),
              this.start_var ? (t = t + '/' + this.start_var) : (t += '/0')),
              this.serv.getTourns(t).subscribe(
                t => {
                  this.tourns = t
                },
                t => {
                  let e = t.status
                  ;[401, 403].includes(e)
                    ? this.router.navigate([''])
                    : alert('Error: ' + e)
                }
              )
          }
          isRoot () {
            return '1' == localStorage.getItem('myRole')
          }
        }
        return (
          (t.ɵfac = function (e) {
            return new (e || t)(Pi(Rv), Pi(Wp), Pi(Ud))
          }),
          (t.ɵcmp = ce({
            type: t,
            selectors: [['app-tourn']],
            viewQuery: function (t, e) {
              var n
              1 & t && (La(Nv, !0), La(Dv, !0)),
                2 & t &&
                  (Ua((n = $a())) && (e.readOnlyTemplate = n.first),
                  Ua((n = $a())) && (e.editTemplate = n.first))
            },
            features: [Eo([Rv])],
            decls: 48,
            vars: 3,
            consts: [
              [1, 'table'],
              [2, 'width', '10%'],
              ['href', '/map'],
              ['href', '/launch'],
              ['href', '/session'],
              ['href', '/payments'],
              ['href', '/profile'],
              [2, 'width', '60%'],
              ['href', '/'],
              [
                'type',
                'button',
                'value',
                'Create Tournament',
                'class',
                'btn btn-default scopeButton',
                3,
                'click',
                4,
                'ngIf'
              ],
              [
                'class',
                'scopeCombobox',
                'name',
                'scope',
                3,
                'ngModel',
                'ngModelChange',
                'change',
                4,
                'ngIf'
              ],
              [1, 'table', 'table-striped'],
              [4, 'ngFor', 'ngForOf'],
              ['readOnlyTemplate', ''],
              ['editTemplate', ''],
              [
                'type',
                'button',
                'value',
                'Create Tournament',
                1,
                'btn',
                'btn-default',
                'scopeButton',
                3,
                'click'
              ],
              [
                'name',
                'scope',
                1,
                'scopeCombobox',
                3,
                'ngModel',
                'ngModelChange',
                'change'
              ],
              [3, 'value'],
              [3, 'ngTemplateOutlet', 'ngTemplateOutletContext'],
              [3, 'click'],
              [
                'type',
                'button',
                'value',
                'Edit',
                'class',
                'btn btn-success',
                3,
                'click',
                4,
                'ngIf'
              ],
              [
                'type',
                'button',
                'value',
                'Delete',
                'class',
                'btn btn-danger',
                3,
                'click',
                4,
                'ngIf'
              ],
              [
                'type',
                'button',
                'value',
                'Close',
                'class',
                'btn btn-danger',
                3,
                'click',
                4,
                'ngIf'
              ],
              [
                'type',
                'button',
                'value',
                'Edit',
                1,
                'btn',
                'btn-success',
                3,
                'click'
              ],
              [
                'type',
                'button',
                'value',
                'Delete',
                1,
                'btn',
                'btn-danger',
                3,
                'click'
              ],
              [
                'type',
                'button',
                'value',
                'Close',
                1,
                'btn',
                'btn-danger',
                3,
                'click'
              ],
              [
                'type',
                'text',
                1,
                'form-control',
                3,
                'ngModel',
                'ngModelChange'
              ],
              [4, 'ngIf'],
              [
                'type',
                'button',
                'value',
                'Save',
                1,
                'btn',
                'btn-success',
                3,
                'click'
              ],
              [
                'type',
                'button',
                'value',
                'Cancel',
                1,
                'btn',
                'btn-warning',
                3,
                'click'
              ],
              [
                'name',
                'edited.setting_id',
                1,
                'form-control',
                3,
                'ngModel',
                'ngModelChange'
              ],
              [3, 'value', 4, 'ngFor', 'ngForOf'],
              [
                'name',
                'edited.timecontrol_id',
                1,
                'form-control',
                3,
                'ngModel',
                'ngModelChange'
              ]
            ],
            template: function (t, e) {
              1 & t &&
                (Vi(0, 'table', 0),
                Vi(1, 'thead'),
                Vi(2, 'tr'),
                Vi(3, 'th', 1),
                Vi(4, 'a', 2),
                ro(5, 'Games'),
                ji(),
                ji(),
                Vi(6, 'th', 1),
                Vi(7, 'a', 3),
                ro(8, 'Launch'),
                ji(),
                ji(),
                Vi(9, 'th', 1),
                Vi(10, 'a', 4),
                ro(11, 'Sessions'),
                ji(),
                ji(),
                Vi(12, 'th', 1),
                Vi(13, 'b'),
                ro(14, 'Tournaments'),
                ji(),
                ji(),
                Vi(15, 'th', 1),
                Vi(16, 'a', 5),
                ro(17, 'Payments'),
                ji(),
                ji(),
                Vi(18, 'th', 1),
                Vi(19, 'a', 6),
                ro(20, 'Profile'),
                ji(),
                ji(),
                Vi(21, 'th', 7),
                Vi(22, 'a', 8),
                ro(23, 'Log Out'),
                ji(),
                ji(),
                ji(),
                ji(),
                ji(),
                Vi(24, 'h3'),
                Ii(25, Vv, 1, 0, 'input', 9),
                Ii(26, jv, 5, 3, 'select', 10),
                ji(),
                Vi(27, 'table', 11),
                Vi(28, 'thead'),
                Vi(29, 'tr'),
                Vi(30, 'td'),
                ro(31, 'Date'),
                ji(),
                Vi(32, 'td'),
                ro(33, 'Title'),
                ji(),
                Vi(34, 'td'),
                ro(35, 'Game'),
                ji(),
                Vi(36, 'td'),
                ro(37, 'Time Control'),
                ji(),
                Vi(38, 'td'),
                ro(39, 'Progress'),
                ji(),
                Fi(40, 'td'),
                Fi(41, 'td'),
                ji(),
                ji(),
                Vi(42, 'tbody'),
                Ii(43, Lv, 2, 4, 'tr', 12),
                ji(),
                ji(),
                Ii(44, zv, 18, 12, 'ng-template', null, 13, Ga),
                Ii(46, Kv, 15, 11, 'ng-template', null, 14, Ga)),
                2 & t &&
                  (Tr(25),
                  Ni('ngIf', !e.isNew),
                  Tr(1),
                  Ni('ngIf', !e.start_game),
                  Tr(17),
                  Ni('ngForOf', e.tourns))
            },
            directives: [Qu, Wu, Rg, lg, gm, Ng, Fg, Yu, eg],
            pipes: [tc],
            styles: [
              '.scopeCombobox[_ngcontent-%COMP%]{min-width:260px;max-width:1000px;float:right}.scopeButton[_ngcontent-%COMP%]{float:left}'
            ]
          })),
          t
        )
      })()
      const Xv = [
        { path: '', component: Vm },
        { path: 'reg', component: yv },
        { path: 'map', component: Ey },
        { path: 'bonus', component: qm, canActivate: [Xm] },
        { path: 'launch/:g/:v/:s', component: vy, canActivate: [Xm] },
        { path: 'launch/:g/:v', component: vy, canActivate: [Xm] },
        { path: 'launch/:g', component: vy, canActivate: [Xm] },
        { path: 'launch', component: vy, canActivate: [Xm] },
        { path: 'session/:s/:g/:v', component: Mv, canActivate: [Xm] },
        { path: 'session/:s/:g', component: Mv, canActivate: [Xm] },
        { path: 'session/:s', component: Mv, canActivate: [Xm] },
        { path: 'session', component: Mv, canActivate: [Xm] },
        { path: 'tournament/:g/:v', component: Yv, canActivate: [Xm] },
        { path: 'tournament', component: Yv, canActivate: [Xm] },
        { path: 'members/:id', component: My, canActivate: [Xm] },
        { path: 'games/:id/:us', component: Ym, canActivate: [Xm] },
        { path: 'games/:id', component: Ym, canActivate: [Xm] },
        { path: 'profile', component: sv, canActivate: [Xm] },
        { path: 'payments', component: $y, canActivate: [Xm] },
        { path: '**', redirectTo: '/' }
      ]
      let t_ = (() => {
          class t {}
          return (
            (t.ɵmod = fe({ type: t })),
            (t.ɵinj = ct({
              factory: function (e) {
                return new (e || t)()
              },
              imports: [[af.forRoot(Xv)], af]
            })),
            t
          )
        })(),
        e_ = (() => {
          class t {
            constructor () {}
            ngOnInit () {}
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)()
            }),
            (t.ɵcmp = ce({
              type: t,
              selectors: [['my-app']],
              decls: 2,
              vars: 0,
              template: function (t, e) {
                1 & t && (Vi(0, 'div'), Fi(1, 'router-outlet'), ji())
              },
              directives: [Jp],
              styles: ['']
            })),
            t
          )
        })(),
        n_ = (() => {
          class t {}
          return (
            (t.ɵmod = fe({ type: t })),
            (t.ɵinj = ct({
              factory: function (e) {
                return new (e || t)()
              },
              imports: [[nc, Rm]]
            })),
            t
          )
        })(),
        r_ = (() => {
          class t {}
          return (
            (t.ɵmod = fe({ type: t })),
            (t.ɵinj = ct({
              factory: function (e) {
                return new (e || t)()
              },
              providers: [iv],
              imports: [[nc, Nm]]
            })),
            t
          )
        })(),
        s_ = (() => {
          class t {}
          return (
            (t.ɵmod = fe({ type: t })),
            (t.ɵinj = ct({
              factory: function (e) {
                return new (e || t)()
              },
              imports: [[nc, Rm]]
            })),
            t
          )
        })(),
        i_ = (() => {
          class t {
            intercept (t, e) {
              let n = localStorage.getItem('myAuthToken')
              return (
                n &&
                  (t = t.clone({
                    setHeaders: { Authorization: `Bearer ${n}` }
                  })),
                e.handle(t)
              )
            }
          }
          return (
            (t.ɵfac = function (e) {
              return new (e || t)()
            }),
            (t.ɵprov = ut({ token: t, factory: t.ɵfac })),
            t
          )
        })(),
        o_ = (() => {
          class t {}
          return (
            (t.ɵmod = fe({ type: t })),
            (t.ɵinj = ct({
              factory: function (e) {
                return new (e || t)()
              },
              providers: [ey],
              imports: [[nc, Rm]]
            })),
            t
          )
        })(),
        a_ = (() => {
          class t {}
          return (
            (t.ɵmod = fe({ type: t })),
            (t.ɵinj = ct({
              factory: function (e) {
                return new (e || t)()
              },
              providers: [Gy],
              imports: [[nc, Nm]]
            })),
            t
          )
        })(),
        l_ = (() => {
          class t {}
          return (
            (t.ɵmod = fe({ type: t })),
            (t.ɵinj = ct({
              factory: function (e) {
                return new (e || t)()
              },
              providers: [_y],
              imports: [[nc, Rm]]
            })),
            t
          )
        })(),
        u_ = (() => {
          class t {}
          return (
            (t.ɵmod = fe({ type: t })),
            (t.ɵinj = ct({
              factory: function (e) {
                return new (e || t)()
              },
              providers: [Ev],
              imports: [[nc, Rm]]
            })),
            t
          )
        })(),
        c_ = (() => {
          class t {}
          return (
            (t.ɵmod = fe({ type: t })),
            (t.ɵinj = ct({
              factory: function (e) {
                return new (e || t)()
              },
              providers: [Rv],
              imports: [[nc, Rm]]
            })),
            t
          )
        })(),
        h_ = (() => {
          class t {}
          return (
            (t.ɵmod = fe({ type: t })),
            (t.ɵinj = ct({
              factory: function (e) {
                return new (e || t)()
              },
              providers: [Ty],
              imports: [[nc, Rm]]
            })),
            t
          )
        })(),
        d_ = (() => {
          class t {}
          return (
            (t.ɵmod = fe({ type: t })),
            (t.ɵinj = ct({
              factory: function (e) {
                return new (e || t)()
              },
              providers: [Bm],
              imports: [[nc, Rm]]
            })),
            t
          )
        })(),
        p_ = (() => {
          class t {}
          return (
            (t.ɵmod = fe({ type: t })),
            (t.ɵinj = ct({
              factory: function (e) {
                return new (e || t)()
              },
              providers: [Ry],
              imports: [[nc, Rm]]
            })),
            t
          )
        })(),
        f_ = (() => {
          class t {}
          return (
            (t.ɵmod = fe({ type: t, bootstrap: [e_] })),
            (t.ɵinj = ct({
              factory: function (e) {
                return new (e || t)()
              },
              providers: [Zf, Xm, { provide: Nf, useClass: i_, multi: !0 }],
              imports: [
                [Ic, Rm, t_, Wf, n_, r_, s_, o_, u_, d_, c_, h_, a_, l_, p_]
              ]
            })),
            t
          )
        })()
      const g_ = jc()
      !(function () {
        if (or) throw new Error('Cannot enable prod mode after platform setup.')
        ir = !1
      })(),
        g_.bootstrapModule(f_)
    },
    zn8P: function (t, e) {
      function n (t) {
        return Promise.resolve().then(function () {
          var e = new Error("Cannot find module '" + t + "'")
          throw ((e.code = 'MODULE_NOT_FOUND'), e)
        })
      }
      ;(n.keys = function () {
        return []
      }),
        (n.resolve = n),
        (t.exports = n),
        (n.id = 'zn8P')
    }
  },
  [[0, 0]]
])
